// First, we must import the schema creator
import createSchema from "part:@sanity/base/schema-creator";

// Then import schema types from any plugins that might expose them
import schemaTypes from "all:part:@sanity/base/schema-type";

import youtube from "./youtube";
// Then we give our schema to the builder and provide the result to Sanity

import React from "react";
import getYouTubeID from "get-youtube-id";

const YouTubePreview = ({ value }) => {
  const id = getYouTubeID(value.url);
  const url = `https://www.youtube.com/embed/${id}`;

  if (!id) {
    return <div>Missing YouTube URL.</div>;
  }
  return (
    <iframe
      title="Youtube Preview"
      width="560"
      height="315"
      src={url}
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
  );
};


export default createSchema({
  // We name our schema
  name: "default",
  // Then proceed to concatenate our document type
  // to the ones provided by any plugins that are installed
  types: schemaTypes.concat([
    {
      name: "author",
      type: "document",
      title: "Author",
      fields: [
        {
          name: "name",
          title: "Name",
          type: "string",
        },
        {
          name: "avatar",
          title: "Avatar",
          type: "image",
        },
      ],
    },
    {
      name: "blog",
      type: "document",
      title: "Blog",
      fields: [
        {
          name: "title",
          type: "string",
          title: "Title",
          validation: (Rule) => {
            return Rule.required().min(5).max(100);
          },
        },
        {
          name: "subtitle",
          type: "string",
          title: "Subtitle",
        },
        {
          name: "coverImage",
          title: "Cover Image",
          type: "image",
          options: {
            hotspot: true,
          },
          fields: [
            {
              type: "text",
              name: "alt",
              title: "Description",
            },
          ],
        },
        {
          name: "content",
          title: "Content",
          type: "array",
          of: [
            {
              type: "block",
            },
            {
              type: "image",
              fields: [
                {
                  title: "Position",
                  name: "position",
                  type: "string",
                  options: {
                    list: [
                      { title: "Center", value: "center" },
                      { title: "Left", value: "left" },
                      { title: "Right", value: "right" },
                    ],
                    layout: "radio",
                    isHighlighted: true,
                  },
                },
                {
                  type: "text",
                  name: "alt",
                  title: "Description",
                  options: {
                    isHighlighted: true,
                  },
                },
              ],
              options: {
                hotspot: true,
              },
            },
            {
              type: "code",
              options: {
                withFilename: true,
              },
            },
            {
              name: "youtube",
              type: "object",
              title: "Youtube Embed",
              fields: [
                {
                  name: "url",
                  type: "url",
                  title: "URL",
                },
              ],
              preview: {
                select: {
                  url: "url",
                },
                component: YouTubePreview,
              },
            },
          ],
        },
        {
          name: "date",
          title: "Date",
          type: "datetime",
          validation: (Rule) => {
            return Rule.required();
          },
        },
        {
          name: "author",
          title: "Author",
          type: "reference",
          to: [{ type: "author" }],
          validation: (Rule) => {
            return Rule.required();
          },
        },
        {
          name: "slug",
          type: "slug",
          title: "Slug",
          validation: (Rule) => {
            return Rule.required();
          },
        },
      ],
    },
    {
      name: "comment",
      type: "document",
      title: "Comment",
      fields: [
        {
          name: "name",
          type: "string",
        },
        {
          name: "approved",
          title: "Approved",
          type: "boolean",
          description: "Comments won't show on the site without approval",
        },
        {
          name: "email",
          type: "string",
        },
        {
          name: "comment",
          type: "text",
        },
        {
          name: "blog",
          type: "reference",
          to: [{ type: "blog" }],
        },
      ],
      preview: {
        select: {
          name: "name",
          comment: "comment",
          post: "blog.title",
        },
        prepare({ name, comment, post }) {
          return {
            title: `${name} on ${post}`,
            subtitle: comment,
          };
        },
      },
    },
  ]),
});
