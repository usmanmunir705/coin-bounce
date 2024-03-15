import styles from "./textInput.module.css"

function TextInput(props) {
    return (
      <div className={styles.textInputWrapper}>
        <input {...props} />
        {props.error && (
          <p className={styles.errorMessage}>{props.errormessage}</p>
        )}
      </div>
    );
  }

export default TextInput