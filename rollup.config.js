import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import { readFileSync } from 'fs';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));

export default {
  input: 'src/lib/index.js',
  output: [
    {
      file: packageJson.main,
      format: 'cjs',
      sourcemap: true,
      name: 'react-advanced-trading-chart'
    },
    {
      file: packageJson.module,
      format: 'esm',
      sourcemap: true
    }
  ],
  plugins: [
    peerDepsExternal(),
    babel({
      exclude: 'node_modules/**',
      presets: ['@babel/preset-env', '@babel/preset-react'],
      babelHelpers: 'runtime',
      extensions: ['.js', '.jsx'],
      plugins: ['@babel/plugin-transform-runtime']
    }),
    resolve({
      browser: true,
      preferBuiltins: false
    }),
    commonjs(),
    terser()
  ],
  external: [
    'react',
    'react-dom',
    'prop-types',
    'd3-format',
    'd3-time-format',
    'd3-scale',
    'd3-shape',
    'd3-dsv',
    'd3-time',
    'react-financial-charts'
  ]
};