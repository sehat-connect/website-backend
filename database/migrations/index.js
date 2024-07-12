const { UserModel,RoleModel }             = require('@database');

const migrate = async () => {
    try {
        let roles = await RoleModel.findAll();
        if (!roles || !roles.length) {
            roles = [{
                "description" : "Role Access",
                "name" : "Super Admin",
                "code" : "SUPER_ADMIN",
                "active" : true,
                "isAdmin" : true,
            },{
                "description" : "Role Access",
                "name" : "User",
                "code" : "USER",
                "active" : true,
                "isAdmin" : false,
            }];

            await RoleModel.bulkCreate(roles);
        }

       
        let user = await UserModel.findAll();
        if (!user || !user.length) {
            let role = ((await RoleModel.findOne({where :{code: 'SUPER_ADMIN'}})) || {}).id || '';
            user = {
                "userName" : "cyberworx",
                "firstName": "Admin",
                "lastName": "User",
                "email" : "yasin@cyberworx.in",
                "password": "admin@user",
                "role":role,
                "active": true,
            };

           await UserModel.create(user);
          
        }
        return true;
    } catch (e) {
        console.log(" error : ",e);
        return true;
    }
}

migrate();