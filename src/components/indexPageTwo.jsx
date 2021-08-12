import * as React from "react"
import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import * as gsap from 'gsap';
import * as GlslCanvas from 'glslCanvas/dist/GlslCanvas.js';
import imageOne from '../images/8.jpeg';
import imageTwo from '../images/9.jpeg';
import imageThree from '../images/10.jpeg';
import imageFour from '../images/13.jpeg';
import Text from './text';
import './index.css';

const includes = `
  #define NUM_OCTAVES 2

  float rand(vec2 n) { 
      return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
  }

  float noise(vec2 p){
      vec2 ip = floor(p);
      vec2 u = fract(p);
      u = u*u*(3.0-2.0*u);
      
      float res = mix(
          mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
          mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
      return res*res;
  }

  float fbm(vec2 x) {
      float v = 0.0;
      float a = 0.5;
      vec2 shift = vec2(100);
      // Rotate to reduce axial bias
      mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
      for (int i = 0; i < NUM_OCTAVES; ++i) {
          v += a * noise(x);
          x = rot * x * 2.0 + shift;
          a *= 0.5;
      }
      return v;
  }
`
const frag = function (items) { 
  console.log(items)
  const ifLoop = items.map((item, index) => {
    return `
			if (index == ${index}) { return texture2D(textures[${index}], uv); }
		`
  }).join(" else ")
  
  return `
	#ifdef GL_ES
  precision highp float;
  #endif

  #define MAX ${items.length}

  uniform float u_time;
  uniform vec2 u_resolution;

  uniform float timeline;

  uniform sampler2D textures[MAX];

  uniform float startIndex;
  uniform float endIndex;

  varying vec3 v_normal;
  varying vec2 v_texcoord;
    
    ${includes}

  vec4 sampleColor(int index, vec2 uv) {
      ${ifLoop}
      
      return vec4(1.0, 1.0, 1.0, 1.0);
  }

  void main(void)
  {
      vec2 uv = v_texcoord;
      uv -= 0.5;
      
      float wave = fbm(17.0 * uv + 0.5 * u_time);
      float strength = smoothstep(0.0, 1.0, timeline) - smoothstep(2.0, 3.0, timeline);
      float distortion = mix(0.725, 0.725 + strength, wave);
      
      uv *= distortion;
      uv += 0.5;
      
      
      if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
          discard;
      }
      
      // pick images    
      vec4 startTexture = sampleColor(int(startIndex), uv);
      vec4 endTexture = sampleColor(int(endIndex), uv);
      
      // tween
      float changeTimeline = smoothstep(0.5, 1.5, timeline);
      float mixer = 1.0 - step(changeTimeline, wave);
      
      vec4 color = mix(startTexture, endTexture, mixer);
      
      gl_FragColor = color;
  }
`
}

const paintings = [
  { src: imageOne, title: "lorem ipsum one" },
  { src: imageThree, title: "lorem ipsum two" },
  { src: imageTwo, title: "lorem ipsum three" },
  { src: imageFour, title: "lorem ipsum four" }
]



class IndexPageTwo extends React.Component {
  state = { animate: false, canvas: [], sandbox: [], timeline: performance.now() - 9999, startIndex: '', endIndex: '' }
  canv = React.createRef()
  sizer = function () {
    let {canvas} = this.state;
    const ww = window.innerWidth - 17;
    const wh = window.innerHeight
    const s = Math.min(ww, wh)
    const dpi = window.devicePixelRatio
    canvas.width = ww
    canvas.height = wh
    canvas.style.width = ww + "px"
    canvas.style.height = Math.round(s * 1.0) + "px"
  }
  tick = function () {
    let {sandbox, timeline} = this.state;
    const diff = (performance.now() - timeline) / 1000
    sandbox.setUniform("timeline", diff)
    requestAnimationFrame(this.tick.bind(this))
  }
  timer;
  callNext = () => {
    console.log('callNext')
    clearInterval(this.timer)
    this.timer = setInterval(() => {
      this.callNext()
    }, 10000)
    this.next()
  }
  next = function () {
    let {startIndex, endIndex} = this.state;
    endIndex = endIndex + 1
    if (endIndex > paintings.length - 1) {
      endIndex = 0
    }
    new Promise((res, rej) => {
      res(this.setState({
        endIndex
      }))
    }).then(() => this.update())
  }
  update = function () {
    let {sandbox, startIndex, endIndex} = this.state;
    this.setState({timeline: performance.now()})
    sandbox.setUniform("startIndex", startIndex)
    sandbox.setUniform("endIndex", endIndex)
    this.tick()
    startIndex = endIndex
    this.setState({startIndex, animate: true})
    // setTimeout(() => {this.setState({animate: false})}, 500)
  }
  componentDidMount() {
    let sandbox;
    new Promise((res, rej) => {
      let canvas = document.createElement("canvas");
      sandbox = new GlslCanvas(canvas);
      this.setState({canvas, sandbox})
      let result = frag(paintings)
      sandbox.load(result)
      this.canv.current.append(canvas)
      if (sandbox) {
        res()
      }
    }).then(() => {
      if (sandbox) {
        this.setState({startIndex: 0, endIndex: 0})
        this.sizer()
        this.tick()
        paintings.forEach((painting, index) => {
          sandbox.setUniform(`textures[${index}]`, painting.src)
        })
        this.callNext()
      }
    })
  }
  render() {
    const {startIndex, animate} = this.state;
    return (
      <div>
        <div className="canvas-holder" ref={this.canv}>
          {/* <canvas class="glslCanvas" ref={this.canv}></canvas> */}
        </div>
        {paintings[startIndex] && (
        <Text animate item={paintings[startIndex]} />
        )}
        <button
        onClick={this.callNext.bind(this)}
        >Next</button>
        {/* <img src={imageOne} /> */}
        test
      </div>
    )
  }
}

export default IndexPageTwo;
