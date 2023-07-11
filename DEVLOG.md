# _Hands Free Controller_
<hr>

#### By _Geoffrey Gao_

## Description
_Accessibility application that allows users to browse the internet solely using facial recognition and controls. Intended to aid those with physical conditions or impairments that prevent them from using their hands (e.g., Amputees).  Allows for basic web navigation functionality including cursor movements, clicking, scrolling, and a keyboard._

## Objectives
### Functional Requirements
_The application should:_
* _Allow access to user webcam_
* _Be able to detect and track user's facial position and features (e.g., Face direction, iris position, mouth open/close)_
* _Use the facial recognition to control a web application_

### MVP
* _Control a pseudo-cursor using facial recognition_
* _Trigger a mouse click using facial recognition_
* _Page navigation using pseudo cursor_
* _Open virtual keyboard for form inputs_

### Stretch Goals 
* _Chrome Extension/Overlay, to allow the application to be used with any website_
* _Training/calibration for webcam motion control tied to a user profile_
* _Advanced motion tracking inputs (e.g. combinations, input patterns, etc.)_
* _Text Prediction for keyboard input to simplify typing process_

## Tools
### Front End:
* _JavaSript_
* _React.js_
* _Redux_

## Resources
* _[Webgazer.js](https://webgazer.cs.brown.edu/): Iris tracking library. Tested out but incredibly jittery. Requires improved hardware for better performance_
* _[Tobii](https://github.com/BenLeech/tobii-eye-mouse-control)_
* _[FaceAPI](https://justadudewhohacks.github.io/face-api.js/docs/index.html)_
* _[CameraMouse](http://cameramouse.org/about.html)_
* _[Simple Keyboard](https://hodgef.com/simple-keyboard/getting-started/)_
* _[Virtual Keyboard](https://furcan.github.io/KioskBoard/)_
* _[Predictive Text Engine](https://docs.replit.com/tutorials/nodejs/predictive-text-engine)_
* _[fakecurosr](https://github.com/Fighter178/FakeCursor/)_
* _[IVLabs](https://www.ivlabs.in/cursor-controlled.html)_


## Notes to Instructor:

_I feel like this is an ambitious project to cover in just 40 hours, but I am excited to give it a try. The biggest concerns I have are:_

* _Working with hardware interface (webcam): How much will this limit my development work? If all my work is dependent on webcam control, I must focus a good portion of time to understanding the webcam input and analysis_
* _Working in a web application: A lot of existing work for webcam controlled cursor are running as external applications, which basically allow for actual mouse control. In a web application environment, especially using JS, you are unable to directly control the mouse. Therefore, a workaround using a pseudo-cursor must be implemented in lieu of actual mouse control_
* _I really want to be able to use this functionality with any website, which means I need to understand how to implement an application as an overlay or chrome extension. For basic demo/testing purposes, I may create a generic HTML page to play around with. While this is technically a stretch goal, this is something that I am really focused on implementing._

_I'm a little worried that a few roadblocks in the development process may drastically change the intended functionality of the project. I think thorough research on the potential functionality of this implementation needs to be done before jumping into the actual development. Nonetheless, I have a few secondary ideas for projects in case this attempt is disastrous_

  

### _Near Term To Do List:_

*  _Improve face interpretation for movement_

*  _Clean up state, currently too many vairables_

*  _Improve look_

  

#### Thursday 06/15/23

*  _10:00AM Intiialized Repo and organized resources_

*  _11:00AM Created Capstone Proposal_

  

#### Saturday 06/17/23

*  _10:00AM Practiced around with pseudo-cursor logic_

  

#### Tuesday 06/20/23

*  _10:00 AM Research FaceAPI.js and Tensorflow for face recognition and landmark detection parameters_

  

#### Wednesday 06/21/23

*  _10:00AM Initialized React app, playing around with implementing FaceAPI.js_

*  _2:00PM Added landmark parsing (eyes, nose, mouth) and display_

  

#### Thursday 06/22/23

*  _6:00PM Added face directionality relative to center_

  

#### Friday 06/23/23

*  _11:00AM Added cursor that moves relative to webcam input_

  

#### Saturday 06/24/23

*  _11:00AM Adding Mouth Open recognition_

  

#### Sunday 06/25/23

*  _2:00PM Cursor hover interaction_

  

#### MOnday 06/26/23

*  _7:00AM Cursor hover interaction_

  

#### Tuesday 06/27/23

*  _7:00PM Cursor hover interaction_

  

#### Wednesday 06/28/23

*  _8:00PM Webpack/Chrome Extension research_

  

#### Friday 06/30/23

*  _11:00AM Successfully implemented chrome extension!_

  

#### Saturday 07/01/23

*  _Added extension stylings, code cleanup, and debugging_

  

#### Monday 07/03/23

*  _Implementing virtual keyboard_

  

#### Wednesday 07/05/23

*  _Scroll Buttons_

  

#### Sunday 07/09/23

*  _Updated Chrome Extension Version_

  

#### Monday 07/10/23

*  _Implemented second move type for cursor_

#### Tuesday 07/11/23
* _Added more button functionality and second movement type. Rebuilt for chrome_ 