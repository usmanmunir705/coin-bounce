import { useState } from 'react'
import styles from './Signup.module.css'
import TextInput from '../../Components/TextInput/textInput'
import signupSchema from '../../schemas/signup'
import {useFormik} from "formik"
import {signup} from '../../api/internal'
import {setUser} from '../../store/userSlice'
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom'

function Signup(){

    const dispatch = useDispatch();
    const navigate  = useNavigate();
    const [error, setError] = useState('');


    const handleSignup = async()=>{

        const data={
            name:values.name,
            username:values.username,
            email:values.email,
            password:values.password,
            confirmPassword:values.confirmPassword
        }

        const response = await signup(data)

        if(response.status===201){
            //  1 setUser
            const user={
                _id:response.data.user._id,
                email:response.data.user.email,
                username:response.data.user.username,
                auth:response.data
            }
            dispatch(setUser(user))

             // 2 redirect to home page
             navigate('/')
        }
        else if(response.code==='ERR_BAD_REQUEST'){
            setError(response.response.data.message)
        }
    }
    
    const {values , touched , handleBlur , handleChange , errors} = useFormik({
        initialValues:{
            name:'',
            username:'',
            email:'',
            password:'',
            confirmPassword:''
        },
        validationSchema:signupSchema
    });

    return(
        <div className={styles.signupWrapper}>
        <div className={styles.signupHeader}>signup your account</div>
        <TextInput
          type="text"
          value={values.name}
          name="name"
          onBlur={handleBlur}
          onChange={handleChange}
          placeholder="name"
          error={errors.name && touched.name ? 1 : undefined}
          errormessage={errors.name}
        />
        <TextInput
          type="text"
          value={values.username}
          name="username"
          onBlur={handleBlur}
          onChange={handleChange}
          placeholder="username"
          error={errors.username && touched.username ? 1 : undefined}
          errormessage={errors.username}
        />
        <TextInput
          type="text"
          value={values.email}
          name="email"
          onBlur={handleBlur}
          onChange={handleChange}
          placeholder="email"
          error={errors.email && touched.email ? 1 : undefined}
          errormessage={errors.email}
        />
        <TextInput
          type="password"
          name="password"
          value={values.password}
          onBlur={handleBlur}
          onChange={handleChange}
          placeholder="password"
          error={errors.password && touched.password ? 1 : undefined}
          errormessage={errors.password}
        />
        <TextInput
          type="password"
          name="confirmPassword"
          value={values.confirmPassword}
          onBlur={handleBlur}
          onChange={handleChange}
          placeholder="confirmPassword"
          error={errors.confirmPassword && touched.confirmPassword ? 1 : undefined}
          errormessage={errors.confirmPassword}
        />
          <button className={styles.singupButton} onClick={handleSignup}
          disabled={
          !values.username ||
          !values.password ||
          !values.name ||
          !values.confirmPassword ||
          !values.email ||
          errors.username ||
          errors.password ||
          errors.confirmPassword ||
          errors.name ||
          errors.email
          }>
          Sign Up
          </button>
          <span>
          Already have an account?
          <button className={styles.loginButton} onClick={()=>{navigate('/login')}}>
          Login
          </button>
          </span>

          {error!==''? <p className={styles.errorMessage}>{error}</p>:''}
        </div>

    )
}
export default Signup