# _Hands Free Controller_
**By: Geoffrey Gao**

_An accessibility application that allows for hands-free control of a web browser using webcam input. Uses face recognition through face-api to determine cursor movement and action. Includes functionality that allows users to click, scroll, and input text using various head/face motions/expressions. Can be run in the browser as a Chrome Extension or local/server-side (using Node.js)._

![Demo image of the Hands Free Controller](https://imgur.com/RvEv9gb.jpg)

## Getting Started
![Labeled Functions](https://imgur.com/oz3nWZ2.jpg)
### Webcam Input
***
_The application requires usage of a webcam in order to function. You will be prompted to allow access to the webcam when the application starts. You can confirm that the webcam is correctly functioning by the webcam display in the top right of the application. The facial recognition package should also overlay the face landmark prediction over your image [1]. For proper functionality, please use the application in a well-lit environment with minimal background noise (esp. other faces)._
### Cursor Control Modes
***
_The cursor is controlled based on the location of the face relative to the webcam input. Clicking functionality is enabled when the user opens their mouth (widely). An indicator of a click is when the blue cursor [2] turns to red.  There are two different control schemes for movement of the cursor: Absolute and Relative mode. The two modes can be toggled between using the Cursor Control Mode button [3]._
#### Absolute Control Mode
_Absolute Control Mode moves the cursor to the position of the user's head. For example, if the user's head is located in the top right of the webcam input, the cursor will be be in the same approximate position in the web page. This is the default setting for the cursor control._
#### Relative Control Mode
_Relative Control Mode utilizes motion control similar to how a game controller joystick would function. At the center of the webcam is a "deadzone". If the center of the user's face is in the deadzone, the cursor will not move. If the user moves their face out of the deadzone, the cursor will move in that relative direction. The webcam input is divided into 8 sections, each corresponding with a direction of movement (e.g., up, down-right, left, etc.). The magnitude of the cursor movement is determined by the distance away from the deadzone (i.e., the farther out the user moves their head, the faster the cursor will move in that direction)._

![Relative Control Diagram](https://imgur.com/HwkUd54.jpg)
### Scroll Buttons
***
_For long web pages, the user can scroll up and down a web page using the two scroll buttons [4]. The user should interact with these buttons as they would any other page elements (i.e., opening and closing their mouth)._
### Virtual Keyboard
***
_Text forms can be filled in this application using a virtual keyboard. Simply interact with a text input element (i.e., opening and closing mouth) to open the virtual keyboard. Note: Currently the virtual keyboard functionality only works with websites that have implemented text inputs as HTML input elements._

![Virtual Keyboard Screenshot](https://imgur.com/WysV2yz.jpg)

## Setup/Installation Requirements
### Chrome Extension
***
*  _Clone the repository and locate the folder `extension` within the `Chrome Extension` folder_

*  _Open Google Chrome and navigate to `Chrome://Extensions` in the address bar_

*  _Turn on the switch on the top right of the page that says "Developer Mode" [1]_

*  _Click on the button on the top left of the page that says "Load unpacked". Then select the location of the `extension` folder [2]_
* _Confirm the extension is loaded [3]_

_Note: The extension files can be rebuilt if any modifications are to be made. The source code can be found in the `handsfreecontroller` folder. The depdencies will need to be installed using `npm install`. The `content.js` file can be regenerated using `npm run build` in the terminal_

![Chrome Extension Installation Diagram](https://imgur.com/hJ3iC3f.jpg)
  

### NodeJS
***

*  _Clone the repository and navigate into the `NodeJS` folder_

*  _Install the dependencies by running the command `npm install` in the erminal_

*  _Run the application using `npm run start`_

_Note: The web page is injected as a `HTML` component (this was implemented for testing purposes). If running your own application, the HTML.js will need to be modified_

## Technologies Used
*  _JavaScript/React_
	*  _[face-api.js](https://justadudewhohacks.github.io/face-api.js/docs/index.html)_
	*  _[react-simple-keyboard](https://github.com/hodgef/react-simple-keyboard)_
*  _Node.js_
*  _Manifest V3 (Google Chrome Extension)_
  
## Future Developments
_This is an ongoing project and will be continually developed. Here is a current list of areas of interest for improvements:_
* _Improve motion control scheme using relative cursor control feature. Currently the relative motion parameters are a bit difficult to use_
* _Added functionality using facial expressions (e.g., click and drag, copy paste, etc.)_
* _Calibration tools to allow for a personalized experience_
* _Implement predictive text engine for virtual keyboard_
* _Allow client wide interaction (e.g., open new tab, input new URL)_
* _UI/UX improvements for accessibility_

## Known Bugs

* _Occasional console warning regarding `willReadFrequently` attribute. Note: bug does not hinder performance_
![willReadFrequently error message](https://i.stack.imgur.com/vdV9h.png)
* _Cursor cannot interact with highly styllized/compartmentalized elements. For instance, some text inputs are not implemented as HTML text or input elements_

_Send bug reports to [geoffreygao1@gmail.com](mailto:geoffreygao1@gmail.com)_


## License
Copyright (c) _2023_  _Geoffrey Gao_
