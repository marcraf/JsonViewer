import { describe, it, expect } from 'vitest';
import {
  parseJson,
  formatJson,
  isExpandable,
  getDataType,
  searchJsonPaths
} from '../utils/jsonHelpers';

describe('JSON Helper Utils', () => {
  describe('parseJson', () => {
    it('should parse valid JSON successfully', () => {
      const { data, error } = parseJson('{"name": "test", "val": 123}');
      expect(error).toBeNull();
      expect(data).toEqual({ name: 'test', val: 123 });
    });

    it('should return error for invalid JSON', () => {
      const { data, error } = parseJson('{"name": "test", val: 123');
      expect(data).toBeNull();
      expect(error).not.toBeNull();
      expect(error?.message).toContain('JSON');
    });

    it('should return null data and error for empty input', () => {
      const { data, error } = parseJson('   ');
      expect(data).toBeNull();
      expect(error).toBeNull();
    });
  });

  describe('formatJson', () => {
    it('should stringify object with 2 spaces indentation', () => {
      const formatted = formatJson({ a: 1 });
      expect(formatted).toBe('{\n  "a": 1\n}');
    });
  });

  describe('isExpandable', () => {
    it('should return true for objects and arrays', () => {
      expect(isExpandable({})).toBe(true);
      expect(isExpandable([])).toBe(true);
    });

    it('should return false for primitives and null', () => {
      expect(isExpandable(null)).toBe(false);
      expect(isExpandable('str')).toBe(false);
      expect(isExpandable(123)).toBe(false);
    });
  });

  describe('getDataType', () => {
    it('should identify array and null correctly', () => {
      expect(getDataType([])).toBe('array');
      expect(getDataType(null)).toBe('null');
      expect(getDataType({})).toBe('object');
      expect(getDataType('hello')).toBe('string');
      expect(getDataType(100)).toBe('number');
      expect(getDataType(false)).toBe('boolean');
    });
  });

  describe('searchJsonPaths', () => {
    it('should find matching paths in deeply nested structures', () => {
      const data = {
        user: {
          name: 'Alice',
          details: {
            city: 'Paris'
          }
        },
        tags: ['paris-trip', 'vacation']
      };

      const { matchedPaths, pathsToExpand } = searchJsonPaths(data, 'Paris');
      
      expect(matchedPaths.has('root.user.details.city')).toBe(true);
      expect(pathsToExpand.has('root')).toBe(true);
      expect(pathsToExpand.has('root.user')).toBe(true);
      expect(pathsToExpand.has('root.user.details')).toBe(true);
    });
  });
});
