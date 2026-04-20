import { LANES } from '../utils/Constants';

export function getLaneY(lane: number): number {
  return LANES[lane];
}

export function getRandomLane(): number {
  return Math.floor(Math.random() * LANES.length);
}
