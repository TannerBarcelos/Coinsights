import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Button, Form, FormGroup, Label, Input, Container } from 'reactstrap'
import { useAuth } from '../../contexts/authContext'
import Popup from '../../components/Shared/Popup'

const Login = () => {
  const history = useHistory()
  const [emailInp, setEmailInp] = useState( '' )
  const [pwdInp, setPwdInp] = useState( '' )
  const [showingPopup, setShowingPopup] = useState( false )
  const [popupState, setPopupState] = useState( {
    success: false,
    color: '',
  } )

  const { signIn } = useAuth()

  const onSubmit = async ( e ) => {
    try {

      const { mode, user } = await signIn( emailInp, pwdInp )

      setPopupState( {
        success: true,
        color: 'success',
      } )
      setShowingPopup( true )
      setTimeout( () => {
        setShowingPopup( false )
        history.push( '/coins' )
      }, 1500 )
    } catch ( error ) {
      setPopupState( {
        success: false,
        color: 'danger',
      } )
      setShowingPopup( true )
      setTimeout( () => {
        setShowingPopup( false )
      }, 3000 )
    }
  }

  return (
    <Container
      style={{
        height: '30rem',
        width: '40rem',
        margin: '10rem auto',
        background: '#165ba51a',
        borderRadius: '5px',
        padding: '1rem',
        position: 'relative',
      }}
    >
      <h1>Login</h1>
      {showingPopup && (
        <Popup
          color={popupState.color}
          msg={
            popupState.success
              ? 'Successfully logged in!'
              : 'There was a problem signing in'
          }
        />
      )}
      <Form>
        <FormGroup>
          <Label for='emailInput'>Email</Label>
          <Input
            type='email'
            name='email'
            id='emailInput'
            onChange={( e ) => setEmailInp( e.target.value )}
            className='coin-inp'
          />
          <Label for='passwordInput'>Password</Label>
          <Input
            type='password'
            name='password'
            id='passwordInput'
            onChange={( e ) => setPwdInp( e.target.value )}
            className='coin-inp'
          />
        </FormGroup>
        <Button onClick={onSubmit}>Login</Button>
      </Form>
      <p style={{ display: 'inline-block', marginTop: '1rem' }}>
        Not signed up? Sign up <Link to='/register'>here</Link>
      </p>
      <Link
        to='/'
        style={{ position: 'absolute', bottom: '1rem', left: '1rem' }}
      >
        <Button>
          <i className='fas fa-home'></i>
        </Button>
      </Link>
    </Container>
  )
}

export default Login
