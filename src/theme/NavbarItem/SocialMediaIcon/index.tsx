import * as React from 'react'

import GitHub from './GitHub'
import Instagram from './Instagram'
import LinkedIn from './LinkedIn'
import Twitter from './Twitter'

export type SocialMediaIconProps = React.ComponentPropsWithoutRef<'svg'> & {
  type: 'twitter' | 'instagram' | 'github' | 'linkedin'
}

export function SocialMediaIcon({
  type,
  ...rest
}: SocialMediaIconProps): JSX.Element {
  switch (type) {
    case 'github':
      return <GitHub {...rest} />
    case 'linkedin':
      return <LinkedIn {...rest} />
    case 'instagram':
      return <Instagram {...rest} />
    case 'twitter':
      return <Twitter {...rest} />
    default:
      return null
  }
}
