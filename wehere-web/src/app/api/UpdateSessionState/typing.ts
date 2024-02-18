import { z } from "zod";

import { SessionState } from "../ReadSessionState/typing";

export const Params$UpdateSessionState = z.object({
  sessionState: SessionState.partial(),
});

export type Params$UpdateSessionState = z.infer<
  typeof Params$UpdateSessionState
>;
