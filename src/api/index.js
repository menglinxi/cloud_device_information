import User from "./acl/user";
import Token from "./acl/user_token";
import Device from "./acl/device";
import Role from "./acl/role";
import Permission from "./acl/permission";

import Game from "./acl/game";

import Account from "./biz/account";
import Channel from "./biz/channel";

import Payment from './payment/payment';
import UserMsg from "./payment/userMsg";

import CodeBook from "./codebook/code";
import CodeBookGroup from "./codebook/group";

import Mission from './mission/mission';

import Setting from "./setting";

import APM from "./monitor/apm";
import Trace from "./monitor/trace";

import Branch from "./department/branch";
import Department from "./department/department";

import Img from "./img/img";
export default {
  User: User,
  Token: Token,
  Device: Device,
  Role: Role,
  Permission: Permission,
  Game: Game,
  Payment: Payment,
  Account: Account,
  Channel: Channel,
  UserMsg: UserMsg,
  CodeBook: CodeBook,
  CodeBookGroup: CodeBookGroup,
  Mission: Mission,
  Setting: Setting,
  APM: APM,
  Trace: Trace,
  Branch: Branch,
  Department: Department,
  Img: Img
};
