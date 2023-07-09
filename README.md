# _Hands Free Controller_

#### _An accessibility application that allows for hands-free control of a web browser using webcam input._

## Technologies Used

* _JavaScript/React_
* _Node.js_
  * _[face-api.js](https://justadudewhohacks.github.io/face-api.js/docs/index.html)_
  * _[react-simple-keyboard](https://github.com/hodgef/react-simple-keyboard)_
* _Manifest V3 (Chrome Extension)_

## Description

_An accessibility application that allows for hands-free control of a web browser using webcam input. Uses face recognition through face-api to determine cursor movement and action. Includes functionality that allows users to click, scroll, and input text using various head/face motions/expressions. Can be run local/server-side(using Node.js) or in the browser as a Chrome Extension_

## Setup/Installation Requirements

_The application is available in two formats, one that can be run using Manifest V3 as a Google Chrome extension and one that can be run server-side using NodeJS. Please follow the instructions below for each type:_

### Chrome Extension
* _Clone the repository and locate the folder `extension` within the `Chrome Extension` folder_
* _Open Google Chrome and navigate to `Chrome://Extensions` in the address bar_
* _Turn on the switch on the top right of the page that says "Developer Mode"_
* _Click on the button on the top left of the page that says "Load unpacked". Then select the location of the `extension` folder_ 

_Note: The extension files can be rebuilt if any modifications are to be made. The source code can be found in the `handsfreecontroller` folder. The `content.js` file can be regenerated using `NPM run build` in the terminal_

## Known Bugs

_Send bug reports to [geoffreygao1@gmail.com](mailto:geoffreygao1@gmail.com)_

## License

_MIT_

Copyright (c) _2023_ _Geoffrey Gao_

## Research & Planning Log

### _Near Term To Do List:_
  * _Improve face interpretation for movement_
  * _Clean up state, currently too many vairables_
  * _Cursor Control_

#### Thursday 06/15/23
* _10:00AM Intiialized Repo and organized resources_
* _11:00AM Created Capstone Proposal_

#### Saturday 06/17/23
* _10:00AM Practiced around with pseudo-cursor logic_

#### Tuesday 06/20/23
* _10:00 AM Research FaceAPI.js and Tensorflow for face recognition and landmark detection parameters_

#### Wednesday 06/21/23
* _10:00AM Initialized React app, playing around with implementing FaceAPI.js_
* _2:00PM Added landmark parsing (eyes, nose, mouth) and display_

#### Thursday 06/22/23
* _6:00PM Added face directionality relative to center_

#### Friday 06/23/23
* _11:00AM Added cursor that moves relative to webcam input_

#### Saturday 06/24/23
* _11:00AM Adding Mouth Open recognition_

#### Sunday 06/25/23
* _2:00PM Cursor hover interaction_

#### MOnday 06/26/23
* _7:00AM Cursor hover interaction_

#### Tuesday 06/27/23
* _7:00PM Cursor hover interaction_

#### Wednesday 06/28/23
* _8:00PM Webpack/Chrome Extension research_

#### Friday 06/30/23
* _11:00AM Successfully implemented chrome extension!_

#### Saturday 07/01/23
* _Added extension stylings, code cleanup, and debugging_

#### Monday 07/03/23
* _Implementing virtual keyboard_

#### Wednesday 07/05/23
* _Scroll Buttons_

