// Welcome to Keystone!
//
// This file is what Keystone uses as the entry-point to your headless backend
//
// Keystone imports the default export of this file, expecting a Keystone configuration object
//   you can find out more at https://keystonejs.com/docs/apis/config

import { config } from "@keystone-6/core";

// to keep this file tidy, we define our schema in a different file
import { withAuth, session } from "./auth";
import { CMS_ENV } from "./env";
import { lists } from "./schema";

// authentication is configured separately here too, but you might move this elsewhere
// when you write your list-level access control functions, as they typically rely on session data

export default withAuth(
  config({
    db: {
      provider: "postgresql",
      url: CMS_ENV.POSTGRES_URL || "",
    },
    storage: {
      "arn:aws:s3:::wehere-bot-storage": {
        kind: "s3",
        type: "image",
        bucketName: CMS_ENV.S3_BUCKET_NAME,
        region: CMS_ENV.S3_REGION,
        accessKeyId: CMS_ENV.S3_ACCESS_KEY_ID,
        secretAccessKey: CMS_ENV.S3_SECRET_ACCESS_KEY,
        signed: { expiry: 3600 },
      },
    },
    lists,
    session,
  })
);
