const { ReadStream } = require("fs");
const { BaseManager } = require("../BaseManager");
const Routes = require("../../rest/Routes");

exports.PermissionsManager = class PermissionsManager extends BaseManager {
  constructor(data, rest) {
    super(
      {
        baseUrl: data?.baseUrl,
        guild: data?.guild,
        data: data?.data?.permissions,
      },
      rest,
      PermissionsManager
    );

    this.guild = data?.guild;
  }
  async setPermission(permissionId, id) {
    const route = Routes.fields(this.baseUrl, permissionId, "ids");
    const payload = { id };
    const response = await this.rest.request("POST", route, payload);

    return response;
  }
};
