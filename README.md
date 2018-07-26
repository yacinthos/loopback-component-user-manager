# loopback-component-user-manager
User manager components for Loopback. 

# Model relations

## User Model

A User have one group

> User belongsTo a Group

``` json

{
  "name": "user",
  "base": "User",
  "idInjection": true,
  "options": {
    "validateUpsert": true
  },
  "properties": {
    "firstname": {
      "type": "string",
      "required": true
    },
    "lastname": {
      "type": "string",
      "required": true
    },
    "photo": {
      "type": "string",
      "required": false
    }
  },
  "validations": [],
  "relations": {
    "accessTokens": {
      "type": "hasMany",
      "model": "accessToken",
      "foreignKey": "userId",
      "options": {
        "disableInclude": false
      }
    },
    "group": {
      "type": "belongsTo",
      "model": "group",
      "foreignKey": "groupId",
      "options": {
        "disableInclude": false
      }
    }
  },
  "acls": [
    {
      "accessType": "READ",
      "principalType": "ROLE",
      "principalId": "$everyone",
      "permission": "ALLOW"
    }
  ],
  "methods": {}
}

```
## Group Model

A user Group can have many roles

> Group hasMany Roles

``` json

{
  "name": "group",
  "base": "PersistedModel",
  "options": {
    "validateUpsert": true
  },
  "properties": {
    "id": {
      "type": "string",
      "id": true
    },
    "name": {
      "type": "string",
      "required": true
    },
    "description": {
      "type": "string",
      "required": true
    }
  },
  "validations": [],
  "relations": {
    "roles": {
      "type": "hasMany",
      "model": "role",
      "foreignKey": "groupId",
      "through": "groupRoleMapping",
      "options": {
        "disableInclude": false
      }
    }
  },
  "acls": [],
  "methods": {}
}

```

## Role Model

A Role can be use by many groups

> Role hasMany Group

``` json
{
  "name": "role",
  "base": "Role",
  "idInjection": true,
  "options": {
    "validateUpsert": true
  },
  "properties": {},
  "validations": [],
  "relations": {
    "principals": {
      "type": "hasMany",
      "model": "RoleMapping",
      "foreignKey": "roleId"
    },
    "groups": {
      "type": "hasMany",
      "model": "group",
      "foreignKey": "roleId",
      "through": "groupRoleMapping",
      "options": {
        "disableInclude": false
      }
    }
  },
  "acls": [
    {
      "accessType": "*",
      "principalType": "ROLE",
      "principalId": "$everyone",
      "permission": "DENY"
    },
    {
      "accessType": "WRITE",
      "principalType": "ROLE",
      "principalId": "$write_role",
      "permission": "ALLOW"
    },
    {
      "accessType": "READ",
      "principalType": "ROLE",
      "principalId": "$read_role",
      "permission": "ALLOW"
    }
  ],
  "methods": {}
}


```


## groupRoleMapping Model

groupRoleMapping is a through Relation Model for the Many to Many relation between Group and Roles

> groupRoleMapping

``` json
{
  "name": "groupRoleMapping",
  "base": "PersistedModel",
  "options": {
    "validateUpsert": true
  },
  "properties": {
    "id": {
      "type": "string",
      "id":true
    }
  },
  "validations": [],
  "relations": {
    "group": {
      "type": "belongsTo",
      "model": "group",
      "foreignKey": "groupId",
      "options": {
        "disableInclude": false
      }
    },
    "role": {
      "type": "belongsTo",
      "model": "role",
      "foreignKey": "roleId",
      "options": {
        "disableInclude": false
      }
    }
  },
  "acls": [],
  "methods": {}
}

```

## Installation 

```sh
$ npm install @yacinthos/loopback-component-user-manager --save

```

## Configuration

### `Unable loopback-component-user-manager`

Add component configuration option in `server/component-config.json`.

``` json
"@yacinthos/loopback-component-user-manager": {
    "userModel": "user",
    "roleModel":"role",
    "groupModel":"group"
  }
```

* Options

**userModel:** must be the name of the user model

**roleModel:** must be the name of the role model

**groupModel:** must be the name of the group model

### `Setup models loopback-component-user-manager model source`

- Add model source `@yacinthos/loopback-component-user-manager` in `server/model-config.json` under `sources` option.

- Add **user, group, role, groupRoleMapping** models configuration  in `server/model-config.json`

``` json
{
  ...,
  "_meta": {
      "sources": [
        ...,
        "@yacinthos/loopback-component-user-manager",
        ...
      ],
      ...
  },
  "role": {
      "dataSource": "db",
      "public": true
   },
  "group": {
    "dataSource": "db",
    "public": true
  },
  "groupRoleMapping": {
    "dataSource": "db",
    "public": true
  },
  "ACL": {
    "dataSource": "db",
    "public": false
  },
  "RoleMapping": {
    "dataSource": "db",
    "public": false,
    "options": {
      "strictObjectIDCoercion": true
    }
  }
  ...
}
```

## Extending models

You can extend **loopback-component-user-manager** built-in models by follow [Loopback extending models tutorial](https://loopback.io/doc/en/lb3/Extending-built-in-models.html).

> After extending, change loopback-component-user-manager option according to your models 
