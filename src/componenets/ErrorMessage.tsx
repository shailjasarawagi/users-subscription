"use client"
import "../styles/ErrorMessage.css"
interface ErrorMessageProps {
  message: string
}

const ErrorMessage = ({ message }: ErrorMessageProps) => {
  return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <p className="error-message">{message}</p>
      <button className="error-button" onClick={() => window.location.reload()}>
        Try Again
      </button>
    </div>
  )
}

export default ErrorMessage
