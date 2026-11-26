import React from 'react'
import './CeramicPlate.css'

// A 3D glazed ceramic plate with a photo sitting in its well. Size it with the
// `size` prop (px or any CSS length); add a className for placement, shadows
// or hover effects.
const CeramicPlate = ({ src, alt = '', size, className = '', style, ...rest }) => (
  <span
    className={`ceramic-plate ${className}`}
    style={size ? { '--plate-size': typeof size === 'number' ? `${size}px` : size, ...style } : style}
    {...rest}
  >
    <img src={src} alt={alt} />
  </span>
)

export default CeramicPlate
