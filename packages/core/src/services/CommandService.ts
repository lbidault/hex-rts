import { Command } from "../ports/Command";

export class CommandService {
  execute(command: Command) {
    command.execute();
  }
}
