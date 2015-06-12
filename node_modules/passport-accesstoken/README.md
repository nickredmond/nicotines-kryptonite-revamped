passport-accesstoken
==============

Token authentication strategy for Passport.

## Installation
    $ npm install passport-accesstoken

## Usage

The token authentication strategy authenticates users using a username and token. The strategy requires a verify callback, which accepts these credentials and calls done providing a user.

    var TokenStrategy = require('passport-accesstoken').Strategy;
    
    passport.use(new TokenStrategy(
        function (token, done) {
            User.findOne({token: token}, function (err, user) {
                if (err) {
                    return done(err);
                }
                
                if (!user) {
                    return done(null, false);
                }
                
                if (!user.verifyToken(token)) {
                    return done(null, false);
                }
                
                return done(null, user);
            });
        }
    ));

By default, passport-token checks for `token` credentials in either the header or request body in these locations:

### Headers
    
    x-token
    
### Body fields

    token

### Configure

These credential locations can be configured when defining the strategy as follows:

    var TokenStrategy   = require('passport-accesstoken').Strategy;
    var strategyOptions = {
        tokenHeader:    'x-custom-token',        
        tokenField:     'custom-token'
    };
    
    passport.use(new TokenStrategy(strategyOptions,
        function (token, done) {
            User.findOne({token: token}, function (err, user) {
                if (err) {
                    return done(err);
                }
                
                if (!user) {
                    return done(null, false);
                }
                
                if (!user.verifyToken(token)) {
                    return done(null, false);
                }
                
                return done(null, user);
            });
        }
   

## Authenticate

Use `passport.authenticate()`, specifying the `token` strategy to authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/) application:

    app.put('/animals/dogs', passport.authenticate('token'), function (req, res) {
        // User authenticated and can be found in req.user
    });

If authentication fails in the above example then a 401 response will be given. However there may be times you wish a bit more control and delegate the failure to your application:

    app.put('/animals/dogs', authenticate, function (req, res) {
           // User authenticated and can be found in req.user
    });
    
    function authenticate(req, res, next) {
        passport.authenticate('token', function (err, user, info) {
            if (err) {
                return next(err);
            }
            
            if (!user) {
                res.status(401).json({message: "Incorrect token credentials"});
            }
           
            req.user = user;
            next();
        });
    }      

## Credits
[Philip Heinser](http://github.com/philipheinser)
[Jared Hanson](http://github.com/jaredhanson)

## License
(The MIT License)

Copyright (c) 2014 appcom interactive GmbH
Copyright (c) 2011 Jared Hanson

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.