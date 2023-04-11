import { allowAll } from "@keystone-6/core/access";
import { list, config } from "@keystone-6/core";
import {
  text,
  relationship,
  timestamp,
  select,
  password,
} from "@keystone-6/core/fields";
import { document } from "@keystone-6/fields-document";

import { withAuth, session } from "./auth";

const lists = {
  User: list({
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
      email: text({ validation: { isRequired: true }, isIndexed: "unique" }),
      posts: relationship({ ref: "Post.author", many: true }),
      password: password({ validation: { isRequired: true } }),
    },
  }),
  Post: list({
    access: allowAll,
    fields: {
      title: text(),
      publishedAt: timestamp(),
      author: relationship({ ref: "User.posts" }),
      content: document({
        formatting: true,
        links: true,
        dividers: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1],
        ],
      }),
      status: select({
        ui: { displayMode: "segmented-control" },
        options: [
          { label: "Draft", value: "draft" },
          { label: "Published", value: "published" },
        ],
        defaultValue: "draft",
      }),
    },
  }),
};

export default config(
  withAuth({
    db: {
      provider: "sqlite",
      url: "file:./keystone.db",
    },
    lists,
    session,
    ui: {
      isAccessAllowed: (ctx) => !!ctx.session?.data,
    },
  })
);
