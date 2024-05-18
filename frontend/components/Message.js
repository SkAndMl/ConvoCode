import bot from "../icons/bot.png";
import user from "../icons/user.png";

import styles from "./Message.module.css";

export default function Message({ role, content }) {

  const user_id = sessionStorage.getItem('myUserID');
  const chat_id = sessionStorage.getItem('myChatID');


  const handleThumbsUp=async()=>{
    const feedback = 1;
    const encodedData = {user_id,chat_id,feedback};
    try {
      const response = await fetch("http://127.0.0.1:8000/chatFeedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(encodedData)
        });
      const data = await response.json();
      console.log(data["message"]);
    } catch (error) {
      console.error('Error: not working', error.message);
    }
  }
  const handleThumbsDown=async()=>{
    const feedback = 0;
    const encodedData = {user_id,chat_id,feedback};
    try {
      const response = await fetch("http://127.0.0.1:8000/chatFeedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(encodedData)
        });
      const data = await response.json();
      console.log(data["message"]);
    } catch (error) {
      console.error('Error: not working', error.message);
    }
  }
  return (
    <div className={styles.wrapper}>
      <div className={styles.avatarContainer}>
        <img
          src={role === "assistant" ? bot : user}
          className={styles.avatar}
          alt="profile avatar"
        />
      </div>
      <div className={styles.contentContainer}>
        <p>{content}</p>
        {/*role === "assistant" && ( 
          <>
            <button onClick={handleThumbsUp} className={styles.feedbackButton}>👍</button>
            <button onClick={handleThumbsDown} className={styles.secondButton}>👎</button>
          </>
        )*/}
      </div>
    </div>
  );
}
