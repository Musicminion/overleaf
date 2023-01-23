<h1 align="center">
  <br>
  <a href="https://www.overleaf.com"><img src="doc/logo.png" alt="Overleaf" width="300"></a>
</h1>
<h4 align="center">Online real-time LaTeX editor Based on Overleaf</h4>

<h1 align="center">
    <br>
    <img src="doc/login.png" alt="Overleaf" width="100%">
</h1>


## Feature
- Support SSO Login like Apple Sign in and GitHub SSO(Version:3.4.0.1)
- Keep and official the latest version

## Environment Var Config
#### How to config
- We assume you use overleaf-toolkit to install overleaf
- You just need to modify `config/variables.env` to config env var
- To be specific, add `XXXXX=XXX` in the tail of `config/variables.env` you download from https://github.com/overleaf/toolkit

#### Global SSO config
- Before your update, it's better for you to have:
  - Your website domain:`your.example.com`
  - certificate of your domain
  - use nginx as inverse proxy, and make sure your website **https** is enabled
  - Permissions for single sign-on configuration(At least clientID and secretID, sometimes redirect URL is also required to config)

| variable name                 | value                                                               | example   |
|-------------------------------|---------------------------------------------------------------------|-----------|
| SHARELATEX_OAUTH_ENABLED      | `True` or `False`, `True` if you want to open sso for your overleaf | `true`    |
| SHARELATEX_OAUTH_HR_LINE_TEXT | text in the divider line,like 'login via other method'              | `通过第三方登陆` |

#### Common SSO config
Before your update your overleaf, pay attention to the following things
 - This part support common SSO support OpenID Connection, OAuth2 App, like github and so on
 - if your overleaf has been put into production environment, please take into careful consideration before update

| variable name                                      | value                                                                                                                    | example(GitHub)                                       |
|----------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------|
| SHARELATEX_OAUTH_COMMON_ENABLED                    | `True` or `False`, `True` if you want to open common sso for your overleaf                                               | `true`                                                |
| SHARELATEX_OAUTH_COMMON_AUTH_URL                   | AUTH_URL of Your Sign In url                                                                                             | `https://github.com/login/oauth/authorize`            |
| SHARELATEX_OAUTH_COMMON_CLIENT_ID                  | CLIENT_ID of your sso app, which shows your app identity                                                                 | `XXXXXXXXXXXXXXXXXXXXXXXXXXX`(length depents on CAS)  |
| SHARELATEX_OAUTH_COMMON_CLIENT_SECRET              | SECRET_ID of your sso app, which use for safety verification                                                             | `XXXXXXXXXXXXXXXXXXXXXXXXXXX`(length depents on CAS)  |
| SHARELATEX_OAUTH_COMMON_REDIRECT_URL               | After successful login, a request will be put to overleaf's api                                                          | `https://your.example.com/auth/oauth/common/callback` |
| SHARELATEX_OAUTH_COMMON_ACCESS_TOKEN_URL           | During login, the url for access token, this is the token for your app to get user info                                  | `https://github.com/login/oauth/access_token`         |
| SHARELATEX_OAUTH_COMMON_USER_PROFILE_URL           | Make Sure this API return json data, which includes user info                                                            | `https://api.github.com/user`                         |
| SHARELATEX_OAUTH_COMMON_BUTTON_NAME                | The text on common sso button of the login view                                                                          | `Login Via Github`                                    |
| SHARELATEX_OAUTH_COMMON_SCOPE                      | What your overleaf want to know from sso server,commonly user email and name, divided by `:`                             | `user:email`                                          |
| SHARELATEX_OAUTH_COMMON_USER_PROFILE_CONTAIN_EMAIL | `True` or `False`,`True` if you are sure userInfo api will return valid user email                                       | `False`                                               |
| SHARELATEX_OAUTH_COMMON_USER_EMAIL_NAME_IDENTIFIER | The field that can identify the uniqueness of the user in the user json information returned by the user profile API     | `node_id`                                             |
| SHARELATEX_OAUTH_COMMON_USER_EMAIL_DOMAIN          | if you set USER_PROFILE_CONTAIN_EMAIL false, we still need a email to register a new user, this is only for email format | `git.oauth2.localhost`                                |

#### Question about Common SSO
- There are already some users in my overleaf, but I want to migrate to single sign-on. What should I do?
- Ans: As we know, overleaf use email as user's only identifier, so just make sure your CAS return the same email as user inputs when registered
- My CAS can't return user's email, how to config env var?
- Ans: First of all,make sure `SHARELATEX_OAUTH_COMMON_USER_PROFILE_CONTAIN_EMAIL=false`, then choose one field that can identify the uniqueness of the user, don't choose `nickname`, since a user may change his nikname later, which may result in login failure
If in these way, in overleaf database, user's email is fake, like `alice@localhost.oauth2`.
- Is it necessary to make SHARELATEX_OAUTH_COMMON_USER_EMAIL_DOMAIN real
- If your organization has Unified mailbox domain name, you can set it to like `baidu.com` or `sjtu.edu.cn`, then choose a field of user's json Profile, which tells fields before `@`.That's to say, if `user['$identifier']` returns `alice`, EMAIL_DOMAIN is `sjtu.edu.cn`, then username will be alice@sjtu.edu.cn.
That's to say, if `alice` use `alice@sjtu.edu.cn` to register maybe some months ago, after your update,if his email has no change, he can direct use sso login without losing any data

#### Code
You can copy it to your env file.
```
SHARELATEX_OAUTH_ENABLED=
SHARELATEX_OAUTH_HR_LINE_TEXT=
SHARELATEX_OAUTH_COMMON_ENABLED=
SHARELATEX_OAUTH_COMMON_AUTH_URL=
SHARELATEX_OAUTH_COMMON_CLIENT_ID=
SHARELATEX_OAUTH_COMMON_CLIENT_SECRET=
SHARELATEX_OAUTH_COMMON_REDIRECT_URL=
SHARELATEX_OAUTH_COMMON_ACCESS_TOKEN_URL=
SHARELATEX_OAUTH_COMMON_USER_PROFILE_URL=
SHARELATEX_OAUTH_COMMON_BUTTON_NAME=
SHARELATEX_OAUTH_COMMON_SCOPE=
SHARELATEX_OAUTH_COMMON_USER_PROFILE_CONTAIN_EMAIL=
SHARELATEX_OAUTH_COMMON_USER_EMAIL_NAME_IDENTIFIER=
SHARELATEX_OAUTH_COMMON_USER_EMAIL_DOMAIN=
```


#### Apple SignIn

| variable name                                         | value                                                                                                                        |
|-------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------|
| SHARELATEX_OAUTH_APPLE_ENABLED                        | `True` or `False`, `True` if you want to open apple sso for your overleaf                                                    |                
| SHARELATEX_OAUTH_APPLE_AUTH_URL                       | Must be `https://appleid.apple.com/auth/authorize`                                                                           | 
| SHARELATEX_OAUTH_APPLE_TOKEN_URL                      | Must be `https://appleid.apple.com/auth/token`                                                                               |                
| SHARELATEX_OAUTH_APPLE_PUBLIC_KEY_URL                 | Must be `https://appleid.apple.com/auth/keys`                                                                                |                
| SHARELATEX_OAUTH_APPLE_CLIENT_ID                      | Find from `https://developer.apple.com/account/resources/identifiers/list/serviceId`, `IDENTIFIER` is what you need          | 
| SHARELATEX_OAUTH_APPLE_AUTH_SERVICE_SECRET_KEY_LINE_1 | Must be `-----BEGIN PRIVATE KEY-----`                                                                                        |
| SHARELATEX_OAUTH_APPLE_AUTH_SERVICE_SECRET_KEY_LINE_2 | The OAuth Service's key you download From `https://developer.apple.com/account/resources/authkeys`                           |
| SHARELATEX_OAUTH_APPLE_AUTH_SERVICE_SECRET_KEY_LINE_3 | You only need to modify LINE2~LINE5 with your p8 file(p8 file has 6 lines, line1 and line6 always keeps the same )           |
| SHARELATEX_OAUTH_APPLE_AUTH_SERVICE_SECRET_KEY_LINE_4 | This key is very long(About 6 Lines), remember to fill it correctly! Keep it secret!                                         |
| SHARELATEX_OAUTH_APPLE_AUTH_SERVICE_SECRET_KEY_LINE_5 | This key is very long(About 6 Lines), remember to fill it correctly! Keep it secret!                                         |
| SHARELATEX_OAUTH_APPLE_AUTH_SERVICE_SECRET_KEY_LINE_6 | Must be `-----END PRIVATE KEY-----`                                                                                          |
| SHARELATEX_OAUTH_APPLE_REDIRECT_URL                   | REDIRECT_URL, must be the same as what you config in apple.Must https!:`https://your.example.com/auth/oauth/common/callback` |
| SHARELATEX_OAUTH_APPLE_SCOPE                          | usually: `name email`                                                                                                        |
| SHARELATEX_OAUTH_Apple_BUTTON_NAME                    | Button text, usually: `Sign with Apple`                                                                                      |
| SHARELATEX_OAUTH_APPLE_AUTH_SERVICE_SECRET_KEY_ID     | Get key ID from `https://developer.apple.com/account/resources/authkeys/list`                                                |
| SHARELATEX_OAUTH_APPLE_DEVELOPER_TEAM_ID              | Get TeamID from `https://developer.apple.com/account`                                                                        |

#### Apple SignIn Env var
```
SHARELATEX_OAUTH_APPLE_ENABLED=true
SHARELATEX_OAUTH_APPLE_AUTH_URL=https://appleid.apple.com/auth/authorize
SHARELATEX_OAUTH_APPLE_TOKEN_URL=https://appleid.apple.com/auth/token
SHARELATEX_OAUTH_APPLE_PUBLIC_KEY_URL=https://appleid.apple.com/auth/keys
SHARELATEX_OAUTH_APPLE_CLIENT_ID=

SHARELATEX_OAUTH_APPLE_AUTH_SERVICE_SECRET_KEY_LINE_1=-----BEGIN PRIVATE KEY-----
SHARELATEX_OAUTH_APPLE_AUTH_SERVICE_SECRET_KEY_LINE_2=
SHARELATEX_OAUTH_APPLE_AUTH_SERVICE_SECRET_KEY_LINE_3=
SHARELATEX_OAUTH_APPLE_AUTH_SERVICE_SECRET_KEY_LINE_4=
SHARELATEX_OAUTH_APPLE_AUTH_SERVICE_SECRET_KEY_LINE_5=
SHARELATEX_OAUTH_APPLE_AUTH_SERVICE_SECRET_KEY_LINE_6=-----END PRIVATE KEY-----

SHARELATEX_OAUTH_APPLE_REDIRECT_URL=
SHARELATEX_OAUTH_APPLE_SCOPE=name email
SHARELATEX_OAUTH_Apple_BUTTON_NAME=Sign with Apple
SHARELATEX_OAUTH_APPLE_AUTH_SERVICE_SECRET_KEY_ID=
SHARELATEX_OAUTH_APPLE_DEVELOPER_TEAM_ID=
```

#### p8 file example
```
-----BEGIN PRIVATE KEY-----
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
XXXXXXXX
-----END PRIVATE KEY-----
```

### Sequence diagram
If you are not familiar with sso, please check Sequence diagram.This png shows common sso logic.
<h1 align="center">
    <img src="doc/commonSSO.svg" alt="Overleaf" width="100%">
</h1>
This png shows apple sso logic.
<h1 align="center">
    <img src="doc/appleSSO.svg" alt="Overleaf" width="100%">
</h1>