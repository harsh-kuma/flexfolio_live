// flexfolio dirctory

•	Folder : Flexfolio_live (Next js , node js , mongo db and express)
•	
   -----Client  (Frontend Folder)
             ----- src
                        ----- app
                                  ----- builder
                                               ----- Page.jsx
                                  ----- portfolio
•	                                               ----- [username]
•	                                                              -----Page.jsx
•	                                  ----- templates
•	                                               ----- [category]
•	                                                              -----[tempalte]
•	                                                                        ----- Page.jsx
•	                                               ----- Page.jsx
•	                                  ----- auth
•	                                               ----- forgot-password
•	                                                              -----Page.jsx
•	                                               ----- google-success
•	                                                              -----Page.jsx
•	                                               ----- login
•	                                                              -----Page.jsx
•	                                               ----- reset-password
•	                                                              -----Page.jsx
•	                                                              -----ResetPasswordClient.jsx
•	                                               ----- signup
•	                                                              -----Page.jsx
•	                                               ----- verify-otp
•	                                                              -----Page.jsx
•	                                                              -----VerifyOtpClient.jsx
•	                                  ----- api
•	                                               ----- auth
•	                                                              -----[…nextauth]
•	                                                                        ----- route.js
•	                                  ----- global.css
•	                                  ----- layout.js
•	                                  ----- page.js
•	                        ----- component
•	                                  ----- auth
•	                                               -----AuthButton.jsx
•	                                               -----AuthInput.jsx
•	                                               -----AuthLayout.jsx
•	                                               -----AuthRedirect.jsx
•	                                               -----SocialLogin.jsx
•	                                  ----- builder
•	                                               ----- DynamicField.jsx
•	                                               ----- RepeatableSection.jsx
•	                                  ----- portfolio
•	                                               ----- PortfolioNotFound.jsx
•	                                               ----- TemplateNotFound.jsx
•	                                  ----- provider
•	                                               ----- AuthProvider.jsx
•	                                               ----- NextAuthProvider.jsx
•	                                               ----- ToastProvider.jsx
•	
•	                        ----- lib
•	                                  ----- validations
•	                                               ----- forgotPasswordValidation.js
•	                                               ----- loginValidation.js
•	                                               ----- otpValidation.js
•	                                               ----- resetPasswordValidation.js
•	                                               ----- signupValidation.js
•	                                  ----- api.js
•	                                  ----- templates.js
•	                                  ----- verifyTemplate.js
•	                        ----- templates
•	                                  ----- template1.jsx
•	                                  ----- template2.jsx
•	                                  ----- template3.jsx
•	                                  ----- template4.jsx
•	                                  ----- template5.jsx
•	                        ----- utils
•	                                  ----- getInitials.js
•	                                  ----- schemas.js
•	                                  ----- templates.js


•	   -----Server (Backend Folder)
•	             ----- config
•	                        ----- cloudinary.js
•	                        ----- db.js
             ----- controllers
•	                        ----- authController.js
•	                        ----- companyController.js
•	                        ----- contactController.js
•	                        ----- portfolioController.js
•	             ----- middlewared
•	                        ----- authMiddleware.js
•	                        ----- rateLimiter.js
•	                        ----- requireFields.js
             ----- models
•	                        ----- User.js
•	                        ----- Portfolio.js
                        ----- ContactMessage.js
             ----- routes
•	                        ----- authRoutes.js
•	                        ----- companyRoutes.js
•	                        ----- contactRoutes.js
•	                        ----- portfolioRoutes.js
             ----- utils
•	                        ----- generateUsername.js
•	                        ----- cookieOptions.js
                        ----- generateAccountUsername.js
                        ----- generateOTP.js
                        ----- getSafeUser.js
                        ----- sendContactMail.js
                        ----- send OTP.js
•	             ----- server.js

