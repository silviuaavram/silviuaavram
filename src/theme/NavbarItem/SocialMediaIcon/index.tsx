import * as React from 'react'

import GitHub from './GitHub'
import Instagram from './Instagram'
import LinkedIn from './LinkedIn'
import Twitter from './Twitter'

type SocialMediaIconType = 'twitter' | 'instagram' | 'github' | 'linkedin'

export type SocialMediaIconProps = React.ComponentPropsWithoutRef<'svg'> & {
  type: SocialMediaIconType
}

const SocialMediaIconComponent: Record<
  SocialMediaIconType,
  React.FunctionComponent<React.ComponentPropsWithoutRef<'svg'>>
> = {
  github: GitHub,
  linkedin: LinkedIn,
  twitter: Twitter,
  instagram: Instagram,
}

export function SocialMediaIcon({
  type,
  ...rest
}: SocialMediaIconProps): JSX.Element {
  const IconComponent = SocialMediaIconComponent[type]

  return <IconComponent {...rest} />
}
