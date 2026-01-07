export default function PictureBubble({ imgSrc, bgColor, dims }) {
  const bubble = {
    backgroundColor: bgColor,
    height: dims.x,
    width: dims.y
  };

  const dimensions = {
    height: dims.x,
    width: dims.y
  };

  return (
    <>
      <div style={dimensions} className='bubble-image-wrapper'>
        <img style={dimensions} className='bubble-image' src={imgSrc}></img>
      </div>
      <div style={bubble} className='background-bubble'></div>
    </>
  );
}
