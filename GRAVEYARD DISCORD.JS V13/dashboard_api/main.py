from ariadne import (gql, graphql_sync, make_executable_schema,
                    QueryType, ObjectType)
from ariadne.constants import PLAYGROUND_HTML
from dotenv import load_dotenv
from flask import Flask, request, jsonify, make_response
import os
import requests
import time

from sessions import Sessions


load_dotenv() # load environment variables from .env

sessions_manager = Sessions('sessions.json')


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

        r = requests.post('https://discord.com/api/v10/oauth2/token', data=data, headers=headers)

        # TODO: handle for this error (should return an error)
        r.raise_for_status() # throws error if status is 4XX

        session_id = sessions_manager.create_session({
            **r.json(), # access_token, etc.
            'ip': request.remote_addr,
            'created_time': round(time.time()), # in seconds
        })
        
        # TODO: remove the '*' and replace with the actual URI (security risk) of the target window
        response = make_response('''
            <script defer>
                window.opener.postMessage(
                    {type: 'discordOAuthLoggedIn'},
                    '*'
                );
                window.close();
            </script>
        ''')
        response.set_cookie('session-id', httponly=True, secure=True,
                            samesite='strict')

        return response, 200

    return 'Error', 400


if __name__ == '__main__':
    app.run(debug=True)
