const execute = async () => {
    // const adminUser = await signup(params);
    // adminUser.role = 'admin';
    // console.log(`Added admin user ${adminUser.email} to database`);
    return true;
};

export default async () => {
    await execute();
};