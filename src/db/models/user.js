import {Schema, model} from "mongoose";
import {emailRegex} from "../../constants/authRegex.js";

const userSchema = new Schema({
  username: {
    type: String,
    minLength: 2,
  },
  email: {
    type: String,
    unique: true,
    match: emailRegex,
    required: true,
  },
  password: {
    type: String,
    trim: true,
    required: true,
  },
  verify: {
    type: Boolean,
    required: true,
    default: false,
  },
  attach: {
    type: String,
    default: "https://ac.goit.global/fullstack/react/default-avatar.jpg",
    optional: true,
  },
}, {
  timestamps: true,
  versionKey: false,
});

//хуки - це функції, які спрацьовують перед або після певних операцій
userSchema.pre("save", function () {  // pre - це є преХук, перед тим, як щось зберегти, виконай цю функцію
  if (!this.username) {
    this.username = this.email;
  }
});

// Коли ми відправляємо обєкт, що отримали з бази на фронтенд методом json і від перетворюється за допом вбудованого методу
// В кожній схемі є метод toJSON - це є вбудований метод і викликається коли потрібно перетворити обєкт на JSON,
// щоби на фронткнд не приходив пароль, так яку це небезпечно, побрібно його видалити
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password; // видали з цього обєкту поле password
  return user;  // і поверни обєкт
}


const User = model("User", userSchema);
export default User;
