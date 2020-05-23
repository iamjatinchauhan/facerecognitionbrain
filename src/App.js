import React , {Component} from 'react';
import Particles from 'react-particles-js';
import Navigation from './component/Navigation/Navigation';
import Signin from './component/Signin/Signin';
import Register from './component/Register/Register';
import FaceRecognition from './component/FaceRecognition/FaceRecognition';
import Logo from './component/Logo/Logo';
import ImageLinkForm from './component/ImageLinkForm/ImageLinkForm';
import Rank from './component/Rank/Rank';
import './App.css';

const particlesOptions = {
"particles": {
        "number": {
            "value": 40,
            "density": {
                "enable": true,
                "value_area": 800 //Denser the smaller the number.
            }
        },
        "color": { //The color for every node, not the connecting lines.
            "value": "#67696b" //Or use an array of colors like ["#9b0000", "#001378", "#0b521f"]
        },
        "shape": {
            "type": "circle", // Can show circle, edge (a square), triangle, polygon, star, img, or an array of multiple.
            "stroke": { //The border
                "width": 1,
                "color": "#3e4040"
            },
            "polygon": { //if the shape is a polygon
                "nb_sides": 5
            },
            "image": { //If the shape is an image
                "src": "",
                "width": 100,
                "height": 100
            }
        },
        "opacity": {
            "value": 0.7,
            "random": true
        },
        "size": {
            "value": 10,
            "random": true
        },
        "line_linked": {
            "enable": true,
            "distance": 200, //The radius before a line is added, the lower the number the more lines.
            "color": "#1b1c1c",
            "opacity": 0.5,
            "width": 2
        },
        "move": {
            "enable": true,
            "speed": 3,
            "direction": "top", //Move them off the canvas, either "none", "top", "right", "bottom", "left", "top-right", "bottom-right" et cetera...
            "random": true,
            "straight": false, //Whether they'll shift left and right while moving.
            "out_mode": "out", //What it'll do when it reaches the end of the canvas, either "out" or "bounce".
            "bounce": false, 
            "attract": { //Make them start to clump together while moving.
                "enable": true,
                "rotateX": 600,
                "rotateY": 1200
            }
        }
    },
  //Negate the default interactivity
  "interactivity": {
        "detect_on": "canvas",
        "events": {
            "onhover": {
                "enable": false,
                "mode": "repulse"
            },
            "onclick": {
                "enable": false,
                "mode": "push"
            },
            "resize": true
        },
        "modes": {
            "grab": {
                "distance": 800,
                "line_linked": {
                    "opacity": 1
                }
            },
            "bubble": {
                "distance": 800,
                "size": 80,
                "duration": 2,
                "opacity": 0.8,
                "speed": 3
            },
            "repulse": {
                "distance": 400,
                "duration": 0.4
            },
            "push": {
                "particles_nb": 4
            },
            "remove": {
                "particles_nb": 2
            }
        }
    },
    "retina_detect": true
}

const initialState =  {
    input: '',
    imageUrl: '',
    box: {},
    route: 'signin',
    isSignedIn: false,
    user: {
      id:'',
      name:'',
      email:'',
      entries:0,
      joined: ''
    }
}
class App extends Component {
  constructor() {
    super ();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({user: {
      id:data.id,
      name:data.name,
      email:data.email,
      entries:data.entries,
      joined: data.joined
    }
    })
  }
  
  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height),
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }
  
  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    fetch('https://infinite-sands-25101.herokuapp.com/imageurl', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        input: this.state.input
      })
    })
    .then(response => response.json())
    .then(response => {
      if(response) {
        fetch('https://infinite-sands-25101.herokuapp.com/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, { entries: count}))
          })
          .catch(console.log)
      }
      this.displayFaceBox(this.calculateFaceLocation(response))
    })
    .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render() {
    const {isSignedIn,imageUrl, route, box} = this.state;
    return (
      <div className="App">
        <Particles className='particles'
                params={particlesOptions}
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        { route === 'home' 
          ? <div>
          <Logo />
          <Rank 
            name={this.state.user.name} 
            entries={this.state.user.entries}
          />
          <ImageLinkForm 
          onInputChange={this.onInputChange} 
          onButtonSubmit={this.onButtonSubmit}
          />
          <FaceRecognition box={box} imageUrl={imageUrl}/>
        </div>
        : (
          route === 'signin' 
          ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        )
        }
      </div>
    );
  }
}

export default App;