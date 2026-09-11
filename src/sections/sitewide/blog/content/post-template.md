---
# Blog post template, copy into content/posts/{slug}.md and rename the copy
# to match the slug. Lives outside posts/ on purpose. Must satisfy
# schemas/post.ts; the build fails otherwise.
#
# YAML GOTCHAS specific to this schema: dates MUST be quoted ("2026-08-29")
# or YAML parses them as Date objects and validation fails; same for
# anything containing a colon.

title: "Post Title"                # quote anything containing a colon
slug: post-title                    # kebab-case; MUST equal the file name
date: "2026-08-29"                  # QUOTED YYYY-MM-DD (see note above)
# updated: "2026-09-02"            # optional revision date, also quoted
excerpt: "One or two sentences for the card, search and RSS description."

tags:                               # kebab-case, at least one
  - practice
  - satvik-living

author: "The Satvik.fyi editors"

# coverImage: hero.jpg              # optional, path under /assets/images/blog/;
                                    # also becomes the social-share image

comments: false                     # true = opt into Giscus comments (needs
                                    # SITE.giscus configured in src/config/site.ts)
draft: false                        # true = excluded from listing, tags & RSS
---


The post body, Markdown. Full prose; the prose classes are applied by the
layout. A few conventions worth keeping:

- Link to module listings and fixed routes across modules
  (/mind/pranayama/, /body/meals/planner/, /quiz/), and to same-module
  detail pages if the blog ever gains them. Never to another module's
  detail pages: those vanish when that module is disabled, and the
  link checker fails the build.
- Satvik is spelled exactly one way: s-a-t-v-i-k.
- No em dashes in copy; commas, colons and parentheses read more human.
