import {ThemeData} from "@/types";

type Messages = typeof import("./src/messages/en.json");
type RuMessages = typeof import("./src/messages/ru.json");
type KkMessages = typeof import("./src/messages/kk.json");

declare interface IntlMessages extends Messages, RuMessages, KkMessages, ThemeData {}
