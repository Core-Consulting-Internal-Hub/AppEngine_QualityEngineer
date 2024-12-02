import { ExternalLink, Flex, Link, Text } from "@dynatrace/strato-components";
import React from "react";

export const ExternalLinks = (props) => {
  return (
    <>
      <Flex flexDirection="column">
        {props.links?.length == 0 ? <Text>N/A</Text> : props.links?.map(item => {
          return (
            <ExternalLink href={item.link}>
              <Link>{item.name}</Link>
            </ExternalLink>
          )
        })}
      </Flex>
    </>
  )
}