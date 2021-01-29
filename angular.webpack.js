/**
 * Custom angular webpack configuration
 */

module.exports = (config, options) => {
    config.target = 'electron-renderer';

    if (options.fileReplacements) {
        for(let fileReplacement of options.fileReplacements) {
            if (fileReplacement.replace !== 'src/environments/environment.ts') {
                continue;
            }

            let fileReplacementParts = fileReplacement['with'].split('.');
            if (fileReplacementParts.length > 1 && ['web'].indexOf(fileReplacementParts[1]) >= 0) {
                config.target = 'web';
            }
            break;
        }
    }

  if (!options.isServer) {
    config.node = {
      fs: 'empty',
      path: 'empty',
      os: 'empty',
      tls: 'empty',
      net: 'empty',
      dns: 'empty',
      http2: 'empty',
      child_process: 'empty',
      readline: 'empty',
      stream: 'empty',
      superCtor: 'empty'
      }
    }

    config.resolve["alias"] = { "stream": require.resolve("stream-browserify") };

    return config;
}

