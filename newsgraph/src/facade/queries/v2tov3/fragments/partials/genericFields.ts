import { query as related } from './related';

export const query = (level: number = 0): string => {
    return `
# START GENERIC

id {
    value
    link
}
contentType
status
version
originalSource
paidStatus
title
subtitle
description
domains
keywords
revision
authors
domainLinks {
    name
    link
}
primaryCategory {
    link
    value
    id
}
categories {
    link
    value
    id
}
references {
    id { value link }
    origin
    originId
    contentType
    referenceType
}

related {
    ${ related(level) }
}

origin
originId

dateCreated
dateLive
dateUpdated

systemOriginUpdated
userOriginUpdated


${
    (level => {
        if (level < 2)
            return `
containerTypes
referenceType
`;
        else
            return '';
    })(level)
}

# END GENERIC
`; };
