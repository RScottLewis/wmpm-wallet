import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Button, Link, Icon } from 'blockchain-info-components'
import {
  SettingComponent,
  SettingContainer,
  SettingDescription,
  SettingHeader,
  SettingSummary
} from 'components/Setting'

const PrivacyPolicy = () => {
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage
            id='scenes.settings.general.privacypolicy.title'
            defaultMessage='Privacy Policy'
          />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage
            id='scenes.settings.general.privacypolicy.description'
            defaultMessage='Read about the privacy and security of your personal information.'
          />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Link href='https://wampum1st.com/privacy-policy' target='_blank'>
          <Button nature='empty'>
            <Icon name='open-in-new-tab' size='20px' />
          </Button>
        </Link>
      </SettingComponent>
    </SettingContainer>
  )
}

export default PrivacyPolicy
