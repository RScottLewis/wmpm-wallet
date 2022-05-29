import React from 'react'
import { connect } from 'react-redux'

import { getData } from './selectors'
import AirdropClaim from './AirdropClaim'
import AirdropReminder from './AirdropReminder'
import KycResubmit from './KycResubmit'
import Swap from './Swap'
import Discount from './Discount'

class Banners extends React.PureComponent {
  render () {
    const { bannerToShow,  isSunRiverTagged } = this.props
    //const { bannerToShow, kycNotFinished, isSunRiverTagged } = this.props
    switch (bannerToShow) {
      case 'resubmit':
        return <KycResubmit />
      case 'airdropReminder':
        return ( //This comes up second
          <AirdropReminder
            campaign='sunriver'
            isSunRiverTagged={isSunRiverTagged}
           />// /<Discount />
        )
      case 'airdropClaim':
        return <Discount />
        //return <AirdropClaim campaign='sunriver' />
      //case 'swap':
        //return <Discount />
        //This comes up first
        //return <Swap kycNotFinished={kycNotFinished} />
      case 'discount':
      	return <Discount />
      default:
        return null
    }
  }
}

const mapStateToProps = state => getData(state)

export default connect(mapStateToProps)(Banners)
