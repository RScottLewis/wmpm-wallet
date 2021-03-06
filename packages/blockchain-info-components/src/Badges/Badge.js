import React from 'react'
import PropTypes from 'prop-types'

import { Link } from '../Links'
import { Image } from '../Images'

const Badge = ({ ...props }) => {
  const { type } = props
  switch (type) {
    case 'applestore':
      return (
        <Link
          href='https://itunes.apple.com/us/app/wampum1st-watcher/id1446220085'
          target='_blank'
        >
          <Image name='app-store-badge' height='40px' />
        </Link>
      )
    case 'googleplay':
      return (
        <Link
          href='https://play.google.com/store/apps/details?id=com.itm.ww'
          target='_blank'
        >
          <Image name='google-play-badge' height='40px' />
        </Link>
      )
    default:
      return <div />
  }
}

Badge.propTypes = {
  type: PropTypes.oneOf(['applestore', 'googleplay']).isRequired
}

export default Badge
