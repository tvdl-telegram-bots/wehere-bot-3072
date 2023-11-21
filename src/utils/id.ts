import { UserId, UserIsh } from "../typing";

export function toUserId(userIsh: UserIsh) {
  if (/^[0-9]+$/.test(userIsh)) {
    return UserId.parse(userIsh);
  }
  throw new Error(`invalid userIsh: ${userIsh}`);
}
