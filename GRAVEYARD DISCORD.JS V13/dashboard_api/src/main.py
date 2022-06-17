from ariadne import (gql, graphql_sync, make_executable_schema,
                    QueryType, ObjectType)
from ariadne.constants import PLAYGROUND_HTML
from dotenv import load_dotenv
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import os
import requests
import time

from sessions import Sessions


load_dotenv() # load environment variables from .env

sessions_manager = Sessions('../data/sessions.json')


# -- GraphQL API under here --

type_defs = gql('''
    type Query {
        hello: String!
    }
''')

query = QueryType()


@query.field('hello')
def resolve_hello(_, info):
    user_agent = info.context.headers.get('user-agent', 'guest')
    return f'Hello, {user_agent}!'


schema = make_executable_schema(type_defs, query)

app = Flask(__name__)

# TODO: make this CORS more specific (only for graphQL, not all paths)
#       (increase security)
# TODO: use cross_origin decorators instead of this CORS function
# this is to stop CORS block on graphQL requests
CORS(
    app,
    resources={
        '/api/graphql': {
            'origins': '*'
        },
        '/api/auth/discord/getsessionid': {
            'origins': 'http://localhost:3000',
            'supports_credentials': True
        }
    }
)


@app.route('/api/graphql', methods=['GET'])
def graphql_playground():
    # This will allow clients to explore your API using desktop GraphQL
    # Playground app. Disable if you dont wan't this.
    return PLAYGROUND_HTML, 200


@app.route('/api/graphql', methods=['POST'])
def graphql_server():
    
    # TODO: Make sure they are authenticated first
    #print(request.cookies.get('session_id'))
    #print(request.cookies)

    # GraphQL queries are always sent as POST
    data = request.get_json()

    success, result = graphql_sync(schema, data, context_value=request,
                                   debug=app.debug)

    status_code = 200 if success else 400
    return jsonify(result), status_code


# -- Discord OAuth2 API under here --


@app.route('/api/auth/discord/redirect', methods=['GET'])
def discord_oauth_redirect():
    if 'code' in request.args:
        code = request.args['code']

        data = {
            'client_id': os.environ['DISCORD_OAUTH_CLIENT_ID'],
            'client_secret': os.environ['DISCORD_OAUTH_CLIENT_SECRET'],
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': request.base_url,
        }

        headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        }

        r = requests.post('https://discord.com/api/v10/oauth2/token',
                          data=data, headers=headers)

        # TODO: handle for this error (should return an error) if the code
        #       given is invalid
        r.raise_for_status() # throws error if status is 4XX

        # a one time use token to get the session id in a cookie on the website
        # when fetch /api/auth/discord/getsessionid?token=<insert token here>
        # this token is sent to the website through a javascript postMessage()
        session_access_token = os.urandom(32).hex()

        # TODO: move the code for creating the session_access_token TODO
        #       sessions.py, or move the check for if the token was used
        #       to this file
        sessions_manager.create_session({
            **r.json(), # access_token, etc.
            'ip': request.remote_addr,
            'created_time': round(time.time()), # in seconds
            'session_access_token': session_access_token,
            'session_access_token_used': False,
        })
        
        # TODO: remove the '*' and replace with the actual URI (reduce security
        #       risk) of the target window
        response = make_response('''
            <script defer>
                window.opener.postMessage(
                    {type: 'discordOAuthLoggedIn', sessionAccessToken: '%s'},
                    '*'
                );
                window.close();
            </script>
        ''' % session_access_token)

        return response, 200

    # TODO: create a better error system (with more information)
    return 'Error', 400


@app.route('/api/auth/discord/getsessionid', methods=['GET'])
def discord_get_session_id():
    os.system('say got the request')

    if 'token' in request.args:
        os.system('say got the token argument')
        session_access_token = request.args['token']

        session_id = sessions_manager.get_session_id_by_session_access_token(session_access_token)

        if session_id is None:
            return 'Error', 400

        response = make_response()
        response.set_cookie('session-id', value=session_id, httponly=True,
                            secure=True, samesite='strict')

        return response, 200

    return 'Error', 400


if __name__ == '__main__':
    app.run(debug=True)
