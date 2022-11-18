import * as React from 'react'

export default function Instagram(
  props: React.ComponentPropsWithoutRef<'svg'>,
): JSX.Element {
  return (
    <svg
      height="24"
      width="24"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title />
      <g data-name="ig instagram insta photo" id="ig_instagram_insta_photo">
        <path
          fill="currentColor"
          d="M20.45,13.32a1,1,0,0,0-.57,1.3,4,4,0,1,1-2.31-2.3,1,1,0,1,0,.71-1.87,6,6,0,0,0-6.37,9.85,6,6,0,0,0,8.48,0,6,6,0,0,0,1.36-6.41A1,1,0,0,0,20.45,13.32Z"
        />
        <circle cx="23" cy="9" r="1" />
        <path
          fill="currentColor"
          d="M28,9a5,5,0,0,0-4.9-5h0A77.11,77.11,0,0,0,9,4,5,5,0,0,0,4,8.92,91.91,91.91,0,0,0,4,23a5,5,0,0,0,4.9,5h0c2.36.22,4.73.34,7.1.34s4.71-.11,7.05-.34A5,5,0,0,0,28,23.08,87.09,87.09,0,0,0,28,9ZM26,23a3,3,0,0,1-3,3h-.1A71.73,71.73,0,0,1,9,26a3,3,0,0,1-3-3.08A92.4,92.4,0,0,1,6,9,3,3,0,0,1,9.09,6q3.44-.31,6.9-.32T23,6a3,3,0,0,1,3,3.08A85.13,85.13,0,0,1,26,23Z"
        />
      </g>
    </svg>
  )
}
