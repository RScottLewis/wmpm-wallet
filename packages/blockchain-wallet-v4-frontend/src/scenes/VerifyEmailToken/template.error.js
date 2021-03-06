import React from 'react'
import styled from 'styled-components'
import { Button, Link, Image, Text } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'

const Wrapper = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  flex-direction: column;
`
const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
`

const Error = props => {
  const { error } = props

  return (
    <Wrapper>
      {error.includes('already been verified') ? (
        <React.Fragment>
          <LogoWrapper>
            <Image name='email-success' width='75px' height='75px' />
          </LogoWrapper>
          <Text
            size='18px'
            weight={400}
            color='marketing-primary'
            style={{ 'margin-top': '10px' }}
          >
            <FormattedMessage
              id='scenes.verifyemailtoken.error.alreadyverified.title'
              defaultMessage='Your email is already verified.'
            />
          </Text>
          <Text style={{ marginTop: '8px' }} size='15px' weight={300}>
            <FormattedMessage
              id='scenes.verifyemailtoken.error.alreadyverified.message'
              defaultMessage='If this was not you, feel free to contact us.'
            />
          </Text>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <LogoWrapper>
            <Image name='email-error' width='75px' height='75px' />
          </LogoWrapper>
          <Text
            size='18px'
            weight={400}
            color='marketing-primary'
            style={{ 'margin-top': '10px' }}
          >
            <FormattedMessage
              id='scenes.verifyemailtoken.error'
              defaultMessage='Something went wrong.'
            />
          </Text>
          <Text style={{ marginTop: '8px' }} size='15px' weight={300}>
            <FormattedMessage
              id='scenes.verifyemailtoken.error.tryagain'
              defaultMessage='Try logging in again or contact support.'
            />
          </Text>
        </React.Fragment>
      )}
      <Link
        target='_blank'
        href='https://support.wmpm.io/hc/en-us/requests/new?ticket_form_id=360000020183'
      >
        <Button
          nature='primary'
          fullwidth
          style={{ marginTop: '20px' }}
          height='50px'
        >
          <FormattedMessage
            id='scenes.verifyemailtoken.error.support'
            defaultMessage='Contact Support'
          />
        </Button>
      </Link>
    </Wrapper>
  )
}

export default Error
