const host = process.env.HOST;

const config = {
    api: host + '/api',
    host: host,
    freelancerLevels: {
        junior: 'junior',
        middle: 'middle',
        senior: 'senior',
    },
    orderStatuses: {
        new: 'new',
        success: "success",
        canceled: 'canceled',
        confirmed: "confirmed",
    }
}

export default config;