export default function config() {
    process.env.PORT = process.env.PORT || '3000';
    // TODO Uncomment for production
    // process.env.NODE_ENV = 'prod';
    if (process.env.NODE_ENV) {
        // TODO Especify production server subdir if exists
        process.env.SUBDIR = '';
    } else {
        process.env.SUBDIR = '';
    }
    process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
    console.log(`Enviroment: ${process.env.NODE_ENV}`);
}