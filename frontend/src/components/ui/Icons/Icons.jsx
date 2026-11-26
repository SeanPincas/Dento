import React from 'react'

// Small inline icons that follow the text colour unless `color` is given.
// All are decorative (aria-hidden); label the button that holds them instead.

const Svg = ({ size = 20, children, fill = 'none', color = 'currentColor', strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox='0 0 24 24' fill={fill} stroke={fill === 'none' ? color : 'none'} strokeWidth={strokeWidth} strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
    {children}
  </svg>
)

export const SearchIcon = (props) => (
  <Svg {...props}><circle cx='11' cy='11' r='7' /><path d='M20 20l-4-4' /></Svg>
)

export const ChevronIcon = ({ direction = 'right', ...props }) => (
  <Svg strokeWidth={2.4} {...props}>
    <path d={direction === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
  </Svg>
)

export const StarIcon = ({ size = 14, color = '#f0c48a' }) => (
  <svg width={size} height={size} viewBox='0 0 24 24' fill={color} aria-hidden='true'>
    <path d='M12 2l3.1 6.6 7.2.9-5.3 5 1.4 7.1L12 18.1 5.6 21.6 7 14.5 1.7 9.5l7.2-.9z' />
  </svg>
)

export const ChopsticksIcon = (props) => (
  <Svg strokeWidth={1.8} {...props}><path d='M5 3l9 18M10 3l9 18' /></Svg>
)

export const HomeIcon = (props) => (
  <Svg strokeWidth={1.9} {...props}><path d='M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z' /></Svg>
)

export const BowlIcon = (props) => (
  <Svg strokeWidth={1.9} {...props}><path d='M3 12h18a9 9 0 0 1-18 0z' /><path d='M8 8 18 3M10 8.5 20 5' /></Svg>
)

export const SlipIcon = (props) => (
  <Svg {...props}><path d='M6 2.5h12v19l-3-2-3 2-3-2-3 2z' /><path d='M9 7.5h6M9 11h6M9 14.5h4' /></Svg>
)

export const UserIcon = (props) => (
  <Svg strokeWidth={1.9} {...props}><circle cx='12' cy='8' r='4' /><path d='M4 21c1-4 4-6 8-6s7 2 8 6' /></Svg>
)

export const PhoneIcon = (props) => (
  <Svg strokeWidth={1.9} {...props}><rect x='7' y='2.5' width='10' height='19' rx='2' /><path d='M11 18h2' /></Svg>
)

export const MailIcon = (props) => (
  <Svg strokeWidth={1.9} {...props}><rect x='3' y='5' width='18' height='14' rx='2' /><path d='M3 7l9 6 9-6' /></Svg>
)

export const LogoutIcon = (props) => (
  <Svg strokeWidth={1.9} {...props}><path d='M15 4h4v16h-4' /><path d='M10 8l-4 4 4 4M6 12h10' /></Svg>
)
