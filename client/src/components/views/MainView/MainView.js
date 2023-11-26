import React from "react";
import { useDimensions } from "../../main/use-dimensions";
import { Canvas } from "../../main/Canvas";
import { Hexagon } from "../../main/Hexagon";
import { getHexagonsToFillZone } from "../../main/random-helpers";
import MappedPhrase from "../../maintext/MappedPhrase";
import {Link} from 'react-router-dom';


const MainView = () => {
  const [ref, { width, height, dpr }] = useDimensions();

  return (
    <div className="mainview" ref={ref}>
      {width === undefined || height === undefined || dpr === undefined ? (
        <div>{"nope"}</div>
      ) : (
        <Canvas width={width} height={height} dpr={dpr} isAnimating={true}>
            <div style={{position: 'absolute'}}>
                <MappedPhrase />
                <br />
                <button className="mainchatbtn"><Link to="chat"><p style={{color:"white", fontSize:"20px"}}>Lets Go!</p></Link></button>
            </div>
          {getHexagonsToFillZone({
            height: height * dpr,
            width: width * dpr
          }).map((hexagon, index) => (
            <Hexagon key={index} {...hexagon} />
          ))}
        </Canvas>
        
      )}
    </div>
  );
};

export default MainView;
