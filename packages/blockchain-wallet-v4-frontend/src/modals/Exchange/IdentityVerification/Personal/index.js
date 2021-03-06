import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { find, map, propEq } from 'ramda'

import { actions, model } from 'data'
import { getData } from './selectors'
import { Remote } from 'blockchain-wallet-v4'

import Personal from './template'
import Loading from './template.loading'
import DataError from 'components/DataError'

export const SCROLL_REF_ID = 'scroll-ref-id'

const getCountryElements = countries => [
  {
    group: '',
    items: map(
      country => ({
        value: country,
        text: country.name
      }),
      countries
    )
  }
]

const { PERSONAL_FORM, EMAIL_STEPS } = model.components.identityVerification
const {
  EDIT_ADDRESS,
  EDIT_COUNTRY,
  EDIT_EMAIL
} = model.analytics.KYC_EVENTS.FORMS

class PersonalContainer extends React.PureComponent {
  state = {
    initialEmailVerified: this.props.emailVerified
  }

  componentDidMount () {
    this.fetchData()
  }

  scrollTop = () => {
    const overflowElement = document.getElementById(SCROLL_REF_ID)
    overflowElement.scrollTop = 0
  }

  fetchData = () => {
    this.props.actions.fetchSupportedCountries()
    this.props.actions.fetchStates()
  }

  selectAddress = (e, address) => {
    e.preventDefault()
    this.props.actions.selectAddress(address)
    this.props.analyticsActions.logEvent(EDIT_ADDRESS)
  }

  onCountryChange = (e, value) => {
    e.preventDefault()
    this.props.formActions.change(PERSONAL_FORM, 'country', value)
    this.props.formActions.clearFields(PERSONAL_FORM, false, false, 'state')
    this.props.analyticsActions.logEvent(EDIT_COUNTRY)
  }

  onPromptForEmailVerification = e => {
    e.preventDefault()
    this.scrollTop()
    this.setState({ showEmailError: true })
  }

  editEmail = () => {
    this.props.actions.setEmailStep(EMAIL_STEPS.edit)
    this.props.analyticsActions.logEvent(EDIT_EMAIL)
  }

  renderForm = ({
    actions,
    initialCountryCode,
    initialEmail,
    email,
    emailVerified,
    emailStep,
    countryCode,
    countryAndStateSelected,
    stateSupported,
    postCode,
    activeField,
    activeFieldError,
    addressRefetchVisible,
    user,
    supportedCountries,
    states,
    handleSubmit
  }) => (
    <Personal
      initialValues={{
        ...user,
        state:
          user.country === 'US'
            ? find(propEq('code', user.state), states) || {}
            : user.state,
        country:
          find(propEq('code', user.country), supportedCountries) ||
          find(propEq('code', initialCountryCode), supportedCountries),
        email: initialEmail
      }}
      showEmail={!this.state.initialEmailVerified}
      showEmailError={!emailVerified && this.state.showEmailError}
      emailVerified={emailVerified}
      email={email}
      emailStep={emailStep}
      countryCode={countryCode}
      countryIsUS={countryCode && countryCode === 'US'}
      showStateError={countryAndStateSelected && !stateSupported}
      showPersonal={countryAndStateSelected && stateSupported}
      postCode={postCode}
      supportedCountries={getCountryElements(supportedCountries)}
      states={getCountryElements(states)}
      addressRefetchVisible={addressRefetchVisible}
      activeField={activeField}
      activeFieldError={activeFieldError}
      editEmail={this.editEmail}
      updateEmail={actions.updateEmail}
      sendEmailVerification={this.onSendEmailVerification}
      onPromptForEmailVerification={this.onPromptForEmailVerification}
      onAddressSelect={this.selectAddress}
      onCountrySelect={this.onCountryChange}
      onSubmit={handleSubmit}
    />
  )

  render () {
    const { countryData, userData, ...rest } = this.props
    return countryData.cata({
      Success: ({ supportedCountries, states }) =>
        userData.cata({
          Success: user =>
            this.renderForm({ ...rest, supportedCountries, states, user }),
          NotAsked: () => <Loading />,
          Loading: () => <Loading />,
          Failure: () =>
            this.renderForm({ ...rest, supportedCountries, states, user: {} })
        }),
      NotAsked: () => <Loading />,
      Loading: () => <Loading />,
      Failure: () => <DataError onClick={this.props.actions.fetchData} />
    })
  }
}

PersonalContainer.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  initialCountryCode: PropTypes.string,
  supportedCountries: PropTypes.instanceOf(Remote).isRequired,
  countryCode: PropTypes.string
}

PersonalContainer.defaultProps = {
  initialCountryCode: '',
  countryCode: ''
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    { ...actions.components.identityVerification, ...actions.modules.profile },
    dispatch
  ),
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

export default connect(
  getData,
  mapDispatchToProps
)(PersonalContainer)
