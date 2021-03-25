<template>
  <div class="container">
    <div class="view login" v-if="!state.user">
      <form @submit.prevent="login" class="login-form">
        <div class="form-inner">
          <h1>Login to VueChat</h1>
          <label for="username">Username</label>
          <input type="text" v-model="userName" placeholder="Enter Your Name" />
          <button type="submit">
            <i class="bx bxs-log-in"></i>&nbsp;Login
          </button>
        </div>
      </form>
    </div>
    <div class="view chat" v-else>
      <header>
        <button class="logout" @click="logout">
          <i class="bx bxs-log-out"></i>&nbsp;Logout
        </button>
        <h1>Welcome, {{ state.user }}</h1>
      </header>
      <section class="chat-box">
        <div
          v-for="message in state.messages"
          :key="message.key"
          :class="
            message.username == state.user ? 'message current-user' : 'message'
          "
        >
          <div class="message-inner">
            <div class="username">{{ message.username }}</div>
            <div class="content">{{ message.content }}</div>
          </div>
        </div>
      </section>
      <footer>
        <form @submit.prevent="sendMessage">
          <input type="text" v-model="message" placeholder="Message..." />
          <button type="submit"><i class="bx bxs-send"></i></button>
        </form>
      </footer>
    </div>
  </div>
</template>
<script>
import { onMounted, reactive, ref } from "vue";
import db from "./data";
export default {
  setup() {
    const userName = ref("");
    const message = ref("");
    const state = reactive({
      user: "",
      messages: [],
    });
    const login = () => {
      if (userName.value !== "" && userName.value !== null) {
        state.user = userName.value;
        userName.value = "";
      }
    };
    const sendMessage = () => {
      const messagesRef = db.database().ref("messages");

      if (message.value !== "" && message.value !== null) {
        const msg = {
          username: state.user,
          content: message.value,
        };
        messagesRef.push(msg);
        message.value = "";
      }
    };
    const logout = () => {
      state.user = "";
    };
    onMounted(() => {
      const messagesRef = db.database().ref("messages");
      messagesRef.on("value", (snapshot) => {
        const data = snapshot.val();
        let messages = [];
        Object.keys(data).forEach((key) => {
          messages.push({
            id: key,
            username: data[key].username,
            content: data[key].content,
          });
        });
        state.messages = messages;
      });
    });
    return {
      userName,
      login,
      state,
      message,
      sendMessage,
      logout,
    };
  },
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap");
* {
  font-family: "Roboto", sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.container {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: skyblue;
}
.view {
  display: flex;
  justify-content: center;
  border-radius: 20px;
  min-height: 100vh;
  &.login {
    align-items: center;
    .login-form {
      display: block;
      width: 100%;
      padding: 15px;

      .form-inner {
        display: block;
        background-color: #fff;
        padding: 50px 15px;
        border-radius: 16px;
        box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
        h1 {
          color: #aaa;
          font-size: 18px;
          margin-bottom: 30px;
          text-align: center;
        }
        label {
          display: block;
          margin-bottom: 5px;
          color: #aaa;
          font-size: 16px;
          transition: 0.4s;
        }
        input[type="text"] {
          appearance: none;
          border: none;
          outline: none;
          background: none;
          display: block;
          width: 100%;
          padding: 10px 15px;
          border-radius: 8px;
          margin-bottom: 15px;

          color: #333;
          font-size: 18px;
          box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);
          background-color: #f3f3f3;
          transition: 0.4s;
          &::placeholder {
            color: #888;
            transition: 0.4s;
          }
        }
        button[type="submit"] {
          appearance: none;
          border: none;
          outline: none;
          background: none;
          display: block;
          width: 100%;
          padding: 10px 15px;
          background-color: #ea526f;
          border-radius: 8px;
          color: #fff;
          font-size: 14px;
          font-weight: 500;
          margin-top: 20px;
        }
        &:focus-within {
          label {
            color: #ea526f;
          }
          input[type="text"] {
            background-color: #fff;
            box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
            &::placeholder {
              color: #666;
            }
          }
        }
      }
    }
  }
  &.chat {
    flex-direction: column;
    header {
      position: relative;
      display: block;
      width: 100%;
      padding: 50px 30px 10px;
      .logout {
        position: absolute;
        top: 15px;
        right: 15px;
        appearance: none;
        border: none;
        outline: none;
        background: none;

        color: #fff;
        font-size: 18px;
        margin-bottom: 10px;
        text-align: right;
      }
      .logout :hover {
        cursor: pointer;
      }
      h1 {
        color: #fff;
        font-size: 18px;
      }
    }
    .chat-box {
      border-radius: 24px 24px 0px 0px;
      background-color: #fff;
      box-shadow: 0px 0px 12px rgba(100, 100, 100, 0.2);
      flex: 1 1 100%;
      padding: 30px;
      scroll-behavior: smooth;
      .message {
        display: flex;
        margin-bottom: 15px;

        .message-inner {
          .username {
            color: #888;
            font-size: 16px;
            margin-bottom: 5px;
            padding-left: 15px;
            padding-right: 15px;
          }
          .content {
            display: inline-block;
            padding: 10px 20px;
            background-color: #f3f3f3;
            border-radius: 999px;
            color: #333;
            font-size: 18px;
            line-height: 1.2em;
            text-align: left;
          }
        }
        &.current-user {
          margin-top: 30px;
          justify-content: flex-end;
          text-align: right;
          .message-inner {
            max-width: 75%;
            .content {
              color: #fff;
              font-weight: 600;
              background-color: #ea526f;
            }
          }
        }
      }
    }
    footer {
      position: sticky;
      bottom: 0px;
      background-color: #fff;
      padding: 30px;
      box-shadow: 0px 0px 12px rgba(100, 100, 100, 0.2);
      form {
        display: flex;
        input[type="text"] {
          flex: 1 1 100%;
          appearance: none;
          border: none;
          outline: none;
          background: none;
          display: block;
          width: 100%;
          padding: 10px 15px;
          border-radius: 8px 0px 0px 8px;

          color: #333;
          font-size: 18px;
          box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);
          background-color: #f3f3f3;
          transition: 0.4s;
          &::placeholder {
            color: #888;
            transition: 0.4s;
          }
        }

        button[type="submit"] {
          appearance: none;
          border: none;
          outline: none;
          background: none;
          display: block;
          padding: 10px 15px;
          border-radius: 0px 8px 8px 0px;
          background-color: #ea526f;
          color: #fff;
          font-size: 18px;
          font-weight: 700;
          &:hover {
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
