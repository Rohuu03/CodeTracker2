import fs from 'fs';
import path from 'path';
import { LeetCodeProblemMetadata, UserProblemHistory } from '../src/types/index';

// Comprehensive seed dataset of publicly available LeetCode problems
// ensuring instant sub-millisecond local queries, zero cold-start delay, and full topic coverage.
const INITIAL_SEED_PROBLEMS: LeetCodeProblemMetadata[] = [
  // Arrays & Hashing
  {
    problemId: '1',
    frontendQuestionId: '1',
    title: 'Two Sum',
    titleSlug: 'two-sum',
    url: 'https://leetcode.com/problems/two-sum/',
    difficulty: 'Easy',
    topicTags: ['Array', 'Hash Table'],
    acceptanceRate: 53.8,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '217',
    frontendQuestionId: '217',
    title: 'Contains Duplicate',
    titleSlug: 'contains-duplicate',
    url: 'https://leetcode.com/problems/contains-duplicate/',
    difficulty: 'Easy',
    topicTags: ['Array', 'Hash Table', 'Sorting'],
    acceptanceRate: 61.9,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '242',
    frontendQuestionId: '242',
    title: 'Valid Anagram',
    titleSlug: 'valid-anagram',
    url: 'https://leetcode.com/problems/valid-anagram/',
    difficulty: 'Easy',
    topicTags: ['Hash Table', 'String', 'Sorting'],
    acceptanceRate: 64.7,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '49',
    frontendQuestionId: '49',
    title: 'Group Anagrams',
    titleSlug: 'group-anagrams',
    url: 'https://leetcode.com/problems/group-anagrams/',
    difficulty: 'Medium',
    topicTags: ['Array', 'Hash Table', 'String', 'Sorting'],
    acceptanceRate: 68.6,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '347',
    frontendQuestionId: '347',
    title: 'Top K Frequent Elements',
    titleSlug: 'top-k-frequent-elements',
    url: 'https://leetcode.com/problems/top-k-frequent-elements/',
    difficulty: 'Medium',
    topicTags: ['Array', 'Hash Table', 'Divide and Conquer', 'Sorting', 'Heap (Priority Queue)', 'Bucket Sort', 'Counting', 'Quickselect'],
    acceptanceRate: 62.8,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '238',
    frontendQuestionId: '238',
    title: 'Product of Array Except Self',
    titleSlug: 'product-of-array-except-self',
    url: 'https://leetcode.com/problems/product-of-array-except-self/',
    difficulty: 'Medium',
    topicTags: ['Array', 'Prefix Sum'],
    acceptanceRate: 66.2,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '36',
    frontendQuestionId: '36',
    title: 'Valid Sudoku',
    titleSlug: 'valid-sudoku',
    url: 'https://leetcode.com/problems/valid-sudoku/',
    difficulty: 'Medium',
    topicTags: ['Array', 'Hash Table', 'Matrix'],
    acceptanceRate: 60.5,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '128',
    frontendQuestionId: '128',
    title: 'Longest Consecutive Sequence',
    titleSlug: 'longest-consecutive-sequence',
    url: 'https://leetcode.com/problems/longest-consecutive-sequence/',
    difficulty: 'Medium',
    topicTags: ['Array', 'Hash Table', 'Union Find'],
    acceptanceRate: 47.4,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '560',
    frontendQuestionId: '560',
    title: 'Subarray Sum Equals K',
    titleSlug: 'subarray-sum-equals-k',
    url: 'https://leetcode.com/problems/subarray-sum-equals-k/',
    difficulty: 'Medium',
    topicTags: ['Array', 'Hash Table', 'Prefix Sum'],
    acceptanceRate: 43.8,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: false,
  },

  // Two Pointers
  {
    problemId: '125',
    frontendQuestionId: '125',
    title: 'Valid Palindrome',
    titleSlug: 'valid-palindrome',
    url: 'https://leetcode.com/problems/valid-palindrome/',
    difficulty: 'Easy',
    topicTags: ['Two Pointers', 'String'],
    acceptanceRate: 47.9,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '167',
    frontendQuestionId: '167',
    title: 'Two Sum II - Input Array Is Sorted',
    titleSlug: 'two-sum-ii-input-array-is-sorted',
    url: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/',
    difficulty: 'Medium',
    topicTags: ['Array', 'Two Pointers', 'Binary Search'],
    acceptanceRate: 61.8,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '15',
    frontendQuestionId: '15',
    title: '3Sum',
    titleSlug: '3sum',
    url: 'https://leetcode.com/problems/3sum/',
    difficulty: 'Medium',
    topicTags: ['Array', 'Two Pointers', 'Sorting'],
    acceptanceRate: 35.6,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '11',
    frontendQuestionId: '11',
    title: 'Container With Most Water',
    titleSlug: 'container-with-most-water',
    url: 'https://leetcode.com/problems/container-with-most-water/',
    difficulty: 'Medium',
    topicTags: ['Array', 'Two Pointers', 'Greedy'],
    acceptanceRate: 55.4,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '42',
    frontendQuestionId: '42',
    title: 'Trapping Rain Water',
    titleSlug: 'trapping-rain-water',
    url: 'https://leetcode.com/problems/trapping-rain-water/',
    difficulty: 'Hard',
    topicTags: ['Array', 'Two Pointers', 'Dynamic Programming', 'Stack', 'Monotonic Stack'],
    acceptanceRate: 62.1,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },

  // Sliding Window
  {
    problemId: '121',
    frontendQuestionId: '121',
    title: 'Best Time to Buy and Sell Stock',
    titleSlug: 'best-time-to-buy-and-sell-stock',
    url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
    difficulty: 'Easy',
    topicTags: ['Array', 'Dynamic Programming'],
    acceptanceRate: 54.3,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '3',
    frontendQuestionId: '3',
    title: 'Longest Substring Without Repeating Characters',
    titleSlug: 'longest-substring-without-repeating-characters',
    url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
    difficulty: 'Medium',
    topicTags: ['Hash Table', 'String', 'Sliding Window'],
    acceptanceRate: 35.1,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '424',
    frontendQuestionId: '424',
    title: 'Longest Repeating Character Replacement',
    titleSlug: 'longest-repeating-character-replacement',
    url: 'https://leetcode.com/problems/longest-repeating-character-replacement/',
    difficulty: 'Medium',
    topicTags: ['Hash Table', 'String', 'Sliding Window'],
    acceptanceRate: 54.7,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '567',
    frontendQuestionId: '567',
    title: 'Permutation in String',
    titleSlug: 'permutation-in-string',
    url: 'https://leetcode.com/problems/permutation-in-string/',
    difficulty: 'Medium',
    topicTags: ['Hash Table', 'Two Pointers', 'String', 'Sliding Window'],
    acceptanceRate: 44.9,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '76',
    frontendQuestionId: '76',
    title: 'Minimum Window Substring',
    titleSlug: 'minimum-window-substring',
    url: 'https://leetcode.com/problems/minimum-window-substring/',
    difficulty: 'Hard',
    topicTags: ['Hash Table', 'String', 'Sliding Window'],
    acceptanceRate: 42.8,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '239',
    frontendQuestionId: '239',
    title: 'Sliding Window Maximum',
    titleSlug: 'sliding-window-maximum',
    url: 'https://leetcode.com/problems/sliding-window-maximum/',
    difficulty: 'Hard',
    topicTags: ['Array', 'Queue', 'Sliding Window', 'Heap (Priority Queue)', 'Monotonic Queue'],
    acceptanceRate: 46.7,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },

  // Stack
  {
    problemId: '20',
    frontendQuestionId: '20',
    title: 'Valid Parentheses',
    titleSlug: 'valid-parentheses',
    url: 'https://leetcode.com/problems/valid-parentheses/',
    difficulty: 'Easy',
    topicTags: ['String', 'Stack'],
    acceptanceRate: 41.2,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '155',
    frontendQuestionId: '155',
    title: 'Min Stack',
    titleSlug: 'min-stack',
    url: 'https://leetcode.com/problems/min-stack/',
    difficulty: 'Medium',
    topicTags: ['Stack', 'Design'],
    acceptanceRate: 54.1,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '150',
    frontendQuestionId: '150',
    title: 'Evaluate Reverse Polish Notation',
    titleSlug: 'evaluate-reverse-polish-notation',
    url: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/',
    difficulty: 'Medium',
    topicTags: ['Array', 'Math', 'Stack'],
    acceptanceRate: 51.5,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '22',
    frontendQuestionId: '22',
    title: 'Generate Parentheses',
    titleSlug: 'generate-parentheses',
    url: 'https://leetcode.com/problems/generate-parentheses/',
    difficulty: 'Medium',
    topicTags: ['String', 'Dynamic Programming', 'Backtracking'],
    acceptanceRate: 75.3,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '739',
    frontendQuestionId: '739',
    title: 'Daily Temperatures',
    titleSlug: 'daily-temperatures',
    url: 'https://leetcode.com/problems/daily-temperatures/',
    difficulty: 'Medium',
    topicTags: ['Array', 'Stack', 'Monotonic Stack'],
    acceptanceRate: 66.8,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '853',
    frontendQuestionId: '853',
    title: 'Car Fleet',
    titleSlug: 'car-fleet',
    url: 'https://leetcode.com/problems/car-fleet/',
    difficulty: 'Medium',
    topicTags: ['Array', 'Stack', 'Sorting', 'Monotonic Stack'],
    acceptanceRate: 51.3,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '84',
    frontendQuestionId: '84',
    title: 'Largest Rectangle in Histogram',
    titleSlug: 'largest-rectangle-in-histogram',
    url: 'https://leetcode.com/problems/largest-rectangle-in-histogram/',
    difficulty: 'Hard',
    topicTags: ['Array', 'Stack', 'Monotonic Stack'],
    acceptanceRate: 44.9,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },

  // Binary Search
  {
    problemId: '704',
    frontendQuestionId: '704',
    title: 'Binary Search',
    titleSlug: 'binary-search',
    url: 'https://leetcode.com/problems/binary-search/',
    difficulty: 'Easy',
    topicTags: ['Array', 'Binary Search'],
    acceptanceRate: 58.1,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '74',
    frontendQuestionId: '74',
    title: 'Search a 2D Matrix',
    titleSlug: 'search-a-2d-matrix',
    url: 'https://leetcode.com/problems/search-a-2d-matrix/',
    difficulty: 'Medium',
    topicTags: ['Array', 'Binary Search', 'Matrix'],
    acceptanceRate: 50.8,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '875',
    frontendQuestionId: '875',
    title: 'Koko Eating Bananas',
    titleSlug: 'koko-eating-bananas',
    url: 'https://leetcode.com/problems/koko-eating-bananas/',
    difficulty: 'Medium',
    topicTags: ['Array', 'Binary Search'],
    acceptanceRate: 49.3,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '153',
    frontendQuestionId: '153',
    title: 'Find Minimum in Rotated Sorted Array',
    titleSlug: 'find-minimum-in-rotated-sorted-array',
    url: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/',
    difficulty: 'Medium',
    topicTags: ['Array', 'Binary Search'],
    acceptanceRate: 51.4,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '33',
    frontendQuestionId: '33',
    title: 'Search in Rotated Sorted Array',
    titleSlug: 'search-in-rotated-sorted-array',
    url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/',
    difficulty: 'Medium',
    topicTags: ['Array', 'Binary Search'],
    acceptanceRate: 41.2,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '981',
    frontendQuestionId: '981',
    title: 'Time Based Key-Value Store',
    titleSlug: 'time-based-key-value-store',
    url: 'https://leetcode.com/problems/time-based-key-value-store/',
    difficulty: 'Medium',
    topicTags: ['Hash Table', 'String', 'Binary Search', 'Design'],
    acceptanceRate: 52.8,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '4',
    frontendQuestionId: '4',
    title: 'Median of Two Sorted Arrays',
    titleSlug: 'median-of-two-sorted-arrays',
    url: 'https://leetcode.com/problems/median-of-two-sorted-arrays/',
    difficulty: 'Hard',
    topicTags: ['Array', 'Binary Search', 'Divide and Conquer'],
    acceptanceRate: 41.6,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },

  // Linked List
  {
    problemId: '206',
    frontendQuestionId: '206',
    title: 'Reverse Linked List',
    titleSlug: 'reverse-linked-list',
    url: 'https://leetcode.com/problems/reverse-linked-list/',
    difficulty: 'Easy',
    topicTags: ['Linked List', 'Recursion'],
    acceptanceRate: 77.2,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '21',
    frontendQuestionId: '21',
    title: 'Merge Two Sorted Lists',
    titleSlug: 'merge-two-sorted-lists',
    url: 'https://leetcode.com/problems/merge-two-sorted-lists/',
    difficulty: 'Easy',
    topicTags: ['Linked List', 'Recursion'],
    acceptanceRate: 64.9,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '141',
    frontendQuestionId: '141',
    title: 'Linked List Cycle',
    titleSlug: 'linked-list-cycle',
    url: 'https://leetcode.com/problems/linked-list-cycle/',
    difficulty: 'Easy',
    topicTags: ['Hash Table', 'Linked List', 'Two Pointers'],
    acceptanceRate: 50.8,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '143',
    frontendQuestionId: '143',
    title: 'Reorder List',
    titleSlug: 'reorder-list',
    url: 'https://leetcode.com/problems/reorder-list/',
    difficulty: 'Medium',
    topicTags: ['Linked List', 'Two Pointers', 'Stack', 'Recursion'],
    acceptanceRate: 57.3,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '19',
    frontendQuestionId: '19',
    title: 'Remove Nth Node From End of List',
    titleSlug: 'remove-nth-node-from-end-of-list',
    url: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/',
    difficulty: 'Medium',
    topicTags: ['Linked List', 'Two Pointers'],
    acceptanceRate: 46.1,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '138',
    frontendQuestionId: '138',
    title: 'Copy List with Random Pointer',
    titleSlug: 'copy-list-with-random-pointer',
    url: 'https://leetcode.com/problems/copy-list-with-random-pointer/',
    difficulty: 'Medium',
    topicTags: ['Hash Table', 'Linked List'],
    acceptanceRate: 57.4,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '2',
    frontendQuestionId: '2',
    title: 'Add Two Numbers',
    titleSlug: 'add-two-numbers',
    url: 'https://leetcode.com/problems/add-two-numbers/',
    difficulty: 'Medium',
    topicTags: ['Linked List', 'Math', 'Recursion'],
    acceptanceRate: 44.2,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '23',
    frontendQuestionId: '23',
    title: 'Merge k Sorted Lists',
    titleSlug: 'merge-k-sorted-lists',
    url: 'https://leetcode.com/problems/merge-k-sorted-lists/',
    difficulty: 'Hard',
    topicTags: ['Linked List', 'Divide and Conquer', 'Heap (Priority Queue)', 'Merge Sort'],
    acceptanceRate: 53.6,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },

  // Trees
  {
    problemId: '226',
    frontendQuestionId: '226',
    title: 'Invert Binary Tree',
    titleSlug: 'invert-binary-tree',
    url: 'https://leetcode.com/problems/invert-binary-tree/',
    difficulty: 'Easy',
    topicTags: ['Tree', 'Depth-First Search', 'Breadth-First Search', 'Binary Tree'],
    acceptanceRate: 77.8,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '104',
    frontendQuestionId: '104',
    title: 'Maximum Depth of Binary Tree',
    titleSlug: 'maximum-depth-of-binary-tree',
    url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/',
    difficulty: 'Easy',
    topicTags: ['Tree', 'Depth-First Search', 'Breadth-First Search', 'Binary Tree'],
    acceptanceRate: 76.2,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '543',
    frontendQuestionId: '543',
    title: 'Diameter of Binary Tree',
    titleSlug: 'diameter-of-binary-tree',
    url: 'https://leetcode.com/problems/diameter-of-binary-tree/',
    difficulty: 'Easy',
    topicTags: ['Tree', 'Depth-First Search', 'Binary Tree'],
    acceptanceRate: 61.3,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '110',
    frontendQuestionId: '110',
    title: 'Balanced Binary Tree',
    titleSlug: 'balanced-binary-tree',
    url: 'https://leetcode.com/problems/balanced-binary-tree/',
    difficulty: 'Easy',
    topicTags: ['Tree', 'Depth-First Search', 'Binary Tree'],
    acceptanceRate: 52.6,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '100',
    frontendQuestionId: '100',
    title: 'Same Tree',
    titleSlug: 'same-tree',
    url: 'https://leetcode.com/problems/same-tree/',
    difficulty: 'Easy',
    topicTags: ['Tree', 'Depth-First Search', 'Breadth-First Search', 'Binary Tree'],
    acceptanceRate: 62.5,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '572',
    frontendQuestionId: '572',
    title: 'Subtree of Another Tree',
    titleSlug: 'subtree-of-another-tree',
    url: 'https://leetcode.com/problems/subtree-of-another-tree/',
    difficulty: 'Easy',
    topicTags: ['Tree', 'Depth-First Search', 'String Matching', 'Binary Tree', 'Hash Function'],
    acceptanceRate: 48.7,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '235',
    frontendQuestionId: '235',
    title: 'Lowest Common Ancestor of a Binary Search Tree',
    titleSlug: 'lowest-common-ancestor-of-a-binary-search-tree',
    url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/',
    difficulty: 'Medium',
    topicTags: ['Tree', 'Depth-First Search', 'Binary Search Tree', 'Binary Tree'],
    acceptanceRate: 65.4,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '102',
    frontendQuestionId: '102',
    title: 'Binary Tree Level Order Traversal',
    titleSlug: 'binary-tree-level-order-traversal',
    url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/',
    difficulty: 'Medium',
    topicTags: ['Tree', 'Breadth-First Search', 'Binary Tree'],
    acceptanceRate: 68.3,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '199',
    frontendQuestionId: '199',
    title: 'Binary Tree Right Side View',
    titleSlug: 'binary-tree-right-side-view',
    url: 'https://leetcode.com/problems/binary-tree-right-side-view/',
    difficulty: 'Medium',
    topicTags: ['Tree', 'Depth-First Search', 'Breadth-First Search', 'Binary Tree'],
    acceptanceRate: 64.9,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '1448',
    frontendQuestionId: '1448',
    title: 'Count Good Nodes in Binary Tree',
    titleSlug: 'count-good-nodes-in-binary-tree',
    url: 'https://leetcode.com/problems/count-good-nodes-in-binary-tree/',
    difficulty: 'Medium',
    topicTags: ['Tree', 'Depth-First Search', 'Breadth-First Search', 'Binary Tree'],
    acceptanceRate: 73.8,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '98',
    frontendQuestionId: '98',
    title: 'Validate Binary Search Tree',
    titleSlug: 'validate-binary-search-tree',
    url: 'https://leetcode.com/problems/validate-binary-search-tree/',
    difficulty: 'Medium',
    topicTags: ['Tree', 'Depth-First Search', 'Binary Search Tree', 'Binary Tree'],
    acceptanceRate: 33.4,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '230',
    frontendQuestionId: '230',
    title: 'Kth Smallest Element in a BST',
    titleSlug: 'kth-smallest-element-in-a-bst',
    url: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/',
    difficulty: 'Medium',
    topicTags: ['Tree', 'Depth-First Search', 'Binary Search Tree', 'Binary Tree'],
    acceptanceRate: 73.1,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '105',
    frontendQuestionId: '105',
    title: 'Construct Binary Tree from Preorder and Inorder Traversal',
    titleSlug: 'construct-binary-tree-from-preorder-and-inorder-traversal',
    url: 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/',
    difficulty: 'Medium',
    topicTags: ['Array', 'Hash Table', 'Divide and Conquer', 'Tree', 'Binary Tree'],
    acceptanceRate: 64.5,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '124',
    frontendQuestionId: '124',
    title: 'Binary Tree Maximum Path Sum',
    titleSlug: 'binary-tree-maximum-path-sum',
    url: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/',
    difficulty: 'Hard',
    topicTags: ['Dynamic Programming', 'Tree', 'Depth-First Search', 'Binary Tree'],
    acceptanceRate: 40.2,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },

  // Graphs & BFS/DFS
  {
    problemId: '200',
    frontendQuestionId: '200',
    title: 'Number of Islands',
    titleSlug: 'number-of-islands',
    url: 'https://leetcode.com/problems/number-of-islands/',
    difficulty: 'Medium',
    topicTags: ['Array', 'Depth-First Search', 'Breadth-First Search', 'Union Find', 'Matrix'],
    acceptanceRate: 60.1,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '695',
    frontendQuestionId: '695',
    title: 'Max Area of Island',
    titleSlug: 'max-area-of-island',
    url: 'https://leetcode.com/problems/max-area-of-island/',
    difficulty: 'Medium',
    topicTags: ['Array', 'Depth-First Search', 'Breadth-First Search', 'Union Find', 'Matrix'],
    acceptanceRate: 72.3,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '133',
    frontendQuestionId: '133',
    title: 'Clone Graph',
    titleSlug: 'clone-graph',
    url: 'https://leetcode.com/problems/clone-graph/',
    difficulty: 'Medium',
    topicTags: ['Hash Table', 'Depth-First Search', 'Breadth-First Search', 'Graph'],
    acceptanceRate: 58.7,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '994',
    frontendQuestionId: '994',
    title: 'Rotting Oranges',
    titleSlug: 'rotting-oranges',
    url: 'https://leetcode.com/problems/rotting-oranges/',
    difficulty: 'Medium',
    topicTags: ['Array', 'Breadth-First Search', 'Matrix'],
    acceptanceRate: 55.4,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '207',
    frontendQuestionId: '207',
    title: 'Course Schedule',
    titleSlug: 'course-schedule',
    url: 'https://leetcode.com/problems/course-schedule/',
    difficulty: 'Medium',
    topicTags: ['Depth-First Search', 'Breadth-First Search', 'Graph', 'Topological Sort'],
    acceptanceRate: 47.9,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '210',
    frontendQuestionId: '210',
    title: 'Course Schedule II',
    titleSlug: 'course-schedule-ii',
    url: 'https://leetcode.com/problems/course-schedule-ii/',
    difficulty: 'Medium',
    topicTags: ['Depth-First Search', 'Breadth-First Search', 'Graph', 'Topological Sort'],
    acceptanceRate: 51.4,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '684',
    frontendQuestionId: '684',
    title: 'Redundant Connection',
    titleSlug: 'redundant-connection',
    url: 'https://leetcode.com/problems/redundant-connection/',
    difficulty: 'Medium',
    topicTags: ['Depth-First Search', 'Breadth-First Search', 'Union Find', 'Graph'],
    acceptanceRate: 64.2,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '127',
    frontendQuestionId: '127',
    title: 'Word Ladder',
    titleSlug: 'word-ladder',
    url: 'https://leetcode.com/problems/word-ladder/',
    difficulty: 'Hard',
    topicTags: ['Hash Table', 'String', 'Breadth-First Search'],
    acceptanceRate: 40.1,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },

  // Dynamic Programming (1D & 2D)
  {
    problemId: '70',
    frontendQuestionId: '70',
    title: 'Climbing Stairs',
    titleSlug: 'climbing-stairs',
    url: 'https://leetcode.com/problems/climbing-stairs/',
    difficulty: 'Easy',
    topicTags: ['Math', 'Dynamic Programming', 'Memoization'],
    acceptanceRate: 53.4,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '746',
    frontendQuestionId: '746',
    title: 'Min Cost Climbing Stairs',
    titleSlug: 'min-cost-climbing-stairs',
    url: 'https://leetcode.com/problems/min-cost-climbing-stairs/',
    difficulty: 'Easy',
    topicTags: ['Array', 'Dynamic Programming'],
    acceptanceRate: 66.8,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '198',
    frontendQuestionId: '198',
    title: 'House Robber',
    titleSlug: 'house-robber',
    url: 'https://leetcode.com/problems/house-robber/',
    difficulty: 'Medium',
    topicTags: ['Array', 'Dynamic Programming'],
    acceptanceRate: 51.5,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '213',
    frontendQuestionId: '213',
    title: 'House Robber II',
    titleSlug: 'house-robber-ii',
    url: 'https://leetcode.com/problems/house-robber-ii/',
    difficulty: 'Medium',
    topicTags: ['Array', 'Dynamic Programming'],
    acceptanceRate: 42.6,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '5',
    frontendQuestionId: '5',
    title: 'Longest Palindromic Substring',
    titleSlug: 'longest-palindromic-substring',
    url: 'https://leetcode.com/problems/longest-palindromic-substring/',
    difficulty: 'Medium',
    topicTags: ['Two Pointers', 'String', 'Dynamic Programming'],
    acceptanceRate: 34.6,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '322',
    frontendQuestionId: '322',
    title: 'Coin Change',
    titleSlug: 'coin-change',
    url: 'https://leetcode.com/problems/coin-change/',
    difficulty: 'Medium',
    topicTags: ['Array', 'Dynamic Programming', 'Breadth-First Search'],
    acceptanceRate: 44.8,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '152',
    frontendQuestionId: '152',
    title: 'Maximum Product Subarray',
    titleSlug: 'maximum-product-subarray',
    url: 'https://leetcode.com/problems/maximum-product-subarray/',
    difficulty: 'Medium',
    topicTags: ['Array', 'Dynamic Programming'],
    acceptanceRate: 35.2,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '139',
    frontendQuestionId: '139',
    title: 'Word Break',
    titleSlug: 'word-break',
    url: 'https://leetcode.com/problems/word-break/',
    difficulty: 'Medium',
    topicTags: ['Array', 'Hash Table', 'String', 'Dynamic Programming', 'Trie', 'Memoization'],
    acceptanceRate: 47.1,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '300',
    frontendQuestionId: '300',
    title: 'Longest Increasing Subsequence',
    titleSlug: 'longest-increasing-subsequence',
    url: 'https://leetcode.com/problems/longest-increasing-subsequence/',
    difficulty: 'Medium',
    topicTags: ['Array', 'Binary Search', 'Dynamic Programming'],
    acceptanceRate: 55.9,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '416',
    frontendQuestionId: '416',
    title: 'Partition Equal Subset Sum',
    titleSlug: 'partition-equal-subset-sum',
    url: 'https://leetcode.com/problems/partition-equal-subset-sum/',
    difficulty: 'Medium',
    topicTags: ['Array', 'Dynamic Programming'],
    acceptanceRate: 46.8,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '62',
    frontendQuestionId: '62',
    title: 'Unique Paths',
    titleSlug: 'unique-paths',
    url: 'https://leetcode.com/problems/unique-paths/',
    difficulty: 'Medium',
    topicTags: ['Math', 'Dynamic Programming', 'Combinatorics'],
    acceptanceRate: 64.9,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '1143',
    frontendQuestionId: '1143',
    title: 'Longest Common Subsequence',
    titleSlug: 'longest-common-subsequence',
    url: 'https://leetcode.com/problems/longest-common-subsequence/',
    difficulty: 'Medium',
    topicTags: ['String', 'Dynamic Programming'],
    acceptanceRate: 58.6,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '72',
    frontendQuestionId: '72',
    title: 'Edit Distance',
    titleSlug: 'edit-distance',
    url: 'https://leetcode.com/problems/edit-distance/',
    difficulty: 'Medium',
    topicTags: ['String', 'Dynamic Programming'],
    acceptanceRate: 57.1,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },

  // Backtracking
  {
    problemId: '78',
    frontendQuestionId: '78',
    title: 'Subsets',
    titleSlug: 'subsets',
    url: 'https://leetcode.com/problems/subsets/',
    difficulty: 'Medium',
    topicTags: ['Array', 'Backtracking', 'Bit Manipulation'],
    acceptanceRate: 78.4,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '39',
    frontendQuestionId: '39',
    title: 'Combination Sum',
    titleSlug: 'combination-sum',
    url: 'https://leetcode.com/problems/combination-sum/',
    difficulty: 'Medium',
    topicTags: ['Array', 'Backtracking'],
    acceptanceRate: 72.3,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '46',
    frontendQuestionId: '46',
    title: 'Permutations',
    titleSlug: 'permutations',
    url: 'https://leetcode.com/problems/permutations/',
    difficulty: 'Medium',
    topicTags: ['Array', 'Backtracking'],
    acceptanceRate: 79.1,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '79',
    frontendQuestionId: '79',
    title: 'Word Search',
    titleSlug: 'word-search',
    url: 'https://leetcode.com/problems/word-search/',
    difficulty: 'Medium',
    topicTags: ['Array', 'String', 'Backtracking', 'Matrix'],
    acceptanceRate: 43.1,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '131',
    frontendQuestionId: '131',
    title: 'Palindrome Partitioning',
    titleSlug: 'palindrome-partitioning',
    url: 'https://leetcode.com/problems/palindrome-partitioning/',
    difficulty: 'Medium',
    topicTags: ['String', 'Dynamic Programming', 'Backtracking'],
    acceptanceRate: 70.8,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '51',
    frontendQuestionId: '51',
    title: 'N-Queens',
    titleSlug: 'n-queens',
    url: 'https://leetcode.com/problems/n-queens/',
    difficulty: 'Hard',
    topicTags: ['Array', 'Backtracking'],
    acceptanceRate: 69.2,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },

  // Heap / Priority Queue
  {
    problemId: '703',
    frontendQuestionId: '703',
    title: 'Kth Largest Element in a Stream',
    titleSlug: 'kth-largest-element-in-a-stream',
    url: 'https://leetcode.com/problems/kth-largest-element-in-a-stream/',
    difficulty: 'Easy',
    topicTags: ['Tree', 'Design', 'Binary Search Tree', 'Heap (Priority Queue)', 'Binary Tree', 'Data Stream'],
    acceptanceRate: 58.7,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '1046',
    frontendQuestionId: '1046',
    title: 'Last Stone Weight',
    titleSlug: 'last-stone-weight',
    url: 'https://leetcode.com/problems/last-stone-weight/',
    difficulty: 'Easy',
    topicTags: ['Array', 'Heap (Priority Queue)'],
    acceptanceRate: 65.8,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '973',
    frontendQuestionId: '973',
    title: 'K Closest Points to Origin',
    titleSlug: 'k-closest-points-to-origin',
    url: 'https://leetcode.com/problems/k-closest-points-to-origin/',
    difficulty: 'Medium',
    topicTags: ['Array', 'Math', 'Divide and Conquer', 'Geometry', 'Sorting', 'Heap (Priority Queue)', 'Quickselect'],
    acceptanceRate: 66.8,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '215',
    frontendQuestionId: '215',
    title: 'Kth Largest Element in an Array',
    titleSlug: 'kth-largest-element-in-an-array',
    url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/',
    difficulty: 'Medium',
    topicTags: ['Array', 'Divide and Conquer', 'Sorting', 'Heap (Priority Queue)', 'Quickselect'],
    acceptanceRate: 67.4,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '621',
    frontendQuestionId: '621',
    title: 'Task Scheduler',
    titleSlug: 'task-scheduler',
    url: 'https://leetcode.com/problems/task-scheduler/',
    difficulty: 'Medium',
    topicTags: ['Array', 'Hash Table', 'Greedy', 'Sorting', 'Heap (Priority Queue)', 'Counting'],
    acceptanceRate: 60.3,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '295',
    frontendQuestionId: '295',
    title: 'Find Median from Data Stream',
    titleSlug: 'find-median-from-data-stream',
    url: 'https://leetcode.com/problems/find-median-from-data-stream/',
    difficulty: 'Hard',
    topicTags: ['Two Pointers', 'Design', 'Sorting', 'Heap (Priority Queue)', 'Data Stream'],
    acceptanceRate: 52.1,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },

  // Greedy
  {
    problemId: '53',
    frontendQuestionId: '53',
    title: 'Maximum Subarray',
    titleSlug: 'maximum-subarray',
    url: 'https://leetcode.com/problems/maximum-subarray/',
    difficulty: 'Medium',
    topicTags: ['Array', 'Divide and Conquer', 'Dynamic Programming'],
    acceptanceRate: 51.2,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '55',
    frontendQuestionId: '55',
    title: 'Jump Game',
    titleSlug: 'jump-game',
    url: 'https://leetcode.com/problems/jump-game/',
    difficulty: 'Medium',
    topicTags: ['Array', 'Dynamic Programming', 'Greedy'],
    acceptanceRate: 39.1,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '45',
    frontendQuestionId: '45',
    title: 'Jump Game II',
    titleSlug: 'jump-game-ii',
    url: 'https://leetcode.com/problems/jump-game-ii/',
    difficulty: 'Medium',
    topicTags: ['Array', 'Dynamic Programming', 'Greedy'],
    acceptanceRate: 40.8,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '134',
    frontendQuestionId: '134',
    title: 'Gas Station',
    titleSlug: 'gas-station',
    url: 'https://leetcode.com/problems/gas-station/',
    difficulty: 'Medium',
    topicTags: ['Array', 'Greedy'],
    acceptanceRate: 45.7,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '846',
    frontendQuestionId: '846',
    title: 'Hand of Straights',
    titleSlug: 'hand-of-straights',
    url: 'https://leetcode.com/problems/hand-of-straights/',
    difficulty: 'Medium',
    topicTags: ['Array', 'Hash Table', 'Greedy', 'Sorting'],
    acceptanceRate: 57.3,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },

  // Intervals
  {
    problemId: '57',
    frontendQuestionId: '57',
    title: 'Insert Interval',
    titleSlug: 'insert-interval',
    url: 'https://leetcode.com/problems/insert-interval/',
    difficulty: 'Medium',
    topicTags: ['Array'],
    acceptanceRate: 41.9,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '56',
    frontendQuestionId: '56',
    title: 'Merge Intervals',
    titleSlug: 'merge-intervals',
    url: 'https://leetcode.com/problems/merge-intervals/',
    difficulty: 'Medium',
    topicTags: ['Array', 'Sorting'],
    acceptanceRate: 48.2,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '435',
    frontendQuestionId: '435',
    title: 'Non-overlapping Intervals',
    titleSlug: 'non-overlapping-intervals',
    url: 'https://leetcode.com/problems/non-overlapping-intervals/',
    difficulty: 'Medium',
    topicTags: ['Array', 'Dynamic Programming', 'Greedy', 'Sorting'],
    acceptanceRate: 54.1,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },

  // Math & Bit Manipulation
  {
    problemId: '136',
    frontendQuestionId: '136',
    title: 'Single Number',
    titleSlug: 'single-number',
    url: 'https://leetcode.com/problems/single-number/',
    difficulty: 'Easy',
    topicTags: ['Array', 'Bit Manipulation'],
    acceptanceRate: 73.5,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '191',
    frontendQuestionId: '191',
    title: 'Number of 1 Bits',
    titleSlug: 'number-of-1-bits',
    url: 'https://leetcode.com/problems/number-of-1-bits/',
    difficulty: 'Easy',
    topicTags: ['Divide and Conquer', 'Bit Manipulation'],
    acceptanceRate: 72.8,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '338',
    frontendQuestionId: '338',
    title: 'Counting Bits',
    titleSlug: 'counting-bits',
    url: 'https://leetcode.com/problems/counting-bits/',
    difficulty: 'Easy',
    topicTags: ['Dynamic Programming', 'Bit Manipulation'],
    acceptanceRate: 78.6,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '268',
    frontendQuestionId: '268',
    title: 'Missing Number',
    titleSlug: 'missing-number',
    url: 'https://leetcode.com/problems/missing-number/',
    difficulty: 'Easy',
    topicTags: ['Array', 'Hash Table', 'Math', 'Binary Search', 'Bit Manipulation', 'Sorting'],
    acceptanceRate: 67.2,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
  {
    problemId: '371',
    frontendQuestionId: '371',
    title: 'Sum of Two Integers',
    titleSlug: 'sum-of-two-integers',
    url: 'https://leetcode.com/problems/sum-of-two-integers/',
    difficulty: 'Medium',
    topicTags: ['Math', 'Bit Manipulation'],
    acceptanceRate: 52.4,
    paidOnly: false,
    hasSolution: true,
    hasVideoSolution: true,
  },
];

class ProblemDatabaseService {
  private problems: Map<string, LeetCodeProblemMetadata> = new Map();
  private lastSyncTime: string = '20 Sep 2026, 1:30 PM';
  private isSyncing: boolean = false;
  private cacheFilePath: string;

  constructor() {
    this.cacheFilePath = path.join(process.cwd(), 'server', 'data', 'leetcode_problems_cache.json');
    this.loadInitialData();
  }

  private loadInitialData() {
    // 1. Seed in-memory map first
    INITIAL_SEED_PROBLEMS.forEach(p => {
      this.problems.set(this.getProblemKey(p), p);
    });

    // 2. Try loading from persistent disk cache if available
    try {
      if (fs.existsSync(this.cacheFilePath)) {
        const fileContent = fs.readFileSync(this.cacheFilePath, 'utf-8');
        const parsed = JSON.parse(fileContent);
        if (Array.isArray(parsed.problems)) {
          parsed.problems.forEach((p: LeetCodeProblemMetadata) => {
            this.problems.set(this.getProblemKey(p), p);
          });
        }
        if (parsed.lastSyncTime) {
          this.lastSyncTime = parsed.lastSyncTime;
        }
      }
    } catch (err) {
      console.warn('Problem cache read notice (using memory seed):', err);
    }
  }

  private getProblemKey(p: { titleSlug?: string; title: string; frontendQuestionId?: string }): string {
    if (p.titleSlug) return p.titleSlug.toLowerCase().trim();
    if (p.frontendQuestionId) return `q_${p.frontendQuestionId}`;
    return p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }

  private saveToDisk() {
    try {
      const dir = path.dirname(this.cacheFilePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(
        this.cacheFilePath,
        JSON.stringify(
          {
            lastSyncTime: this.lastSyncTime,
            count: this.problems.size,
            problems: Array.from(this.problems.values()),
          },
          null,
          2
        )
      );
    } catch (err) {
      console.warn('Failed to persist problem cache to disk:', err);
    }
  }

  /**
   * Fetch live batch from official LeetCode GraphQL
   */
  async fetchBatchFromLeetCode(skip = 0, limit = 50): Promise<LeetCodeProblemMetadata[]> {
    const query = `
      query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
        problemsetQuestionList: questionList(
          categorySlug: $categorySlug
          limit: $limit
          skip: $skip
          filters: $filters
        ) {
          total: totalNum
          questions: data {
            acRate
            difficulty
            freqBar
            frontendQuestionId: questionFrontendId
            isFavor
            paidOnly: isPaidOnly
            status
            title
            titleSlug
            topicTags {
              name
              id
              slug
            }
            hasSolution
            hasVideoSolution
          }
        }
      }
    `;

    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://leetcode.com/problemset/all/',
      },
      body: JSON.stringify({
        query,
        variables: {
          categorySlug: '',
          skip,
          limit,
          filters: {},
        },
      }),
      signal: AbortSignal.timeout(9000),
    });

    if (!response.ok) {
      throw new Error(`LeetCode GraphQL responded with HTTP ${response.status}`);
    }

    const data = await response.json();
    const rawList = data?.data?.problemsetQuestionList?.questions || [];

    return rawList.map((q: any) => {
      const difficulty: 'Easy' | 'Medium' | 'Hard' =
        q.difficulty === 'Hard' ? 'Hard' : q.difficulty === 'Medium' ? 'Medium' : 'Easy';

      const topicTags: string[] = Array.isArray(q.topicTags)
        ? q.topicTags.map((t: any) => t.name || t.slug).filter(Boolean)
        : [];

      return {
        problemId: String(q.frontendQuestionId || q.titleSlug),
        frontendQuestionId: String(q.frontendQuestionId || ''),
        title: q.title,
        titleSlug: q.titleSlug,
        url: `https://leetcode.com/problems/${q.titleSlug}/`,
        difficulty,
        topicTags,
        acceptanceRate: Math.round((Number(q.acRate) || 50) * 10) / 10,
        paidOnly: Boolean(q.paidOnly),
        hasSolution: Boolean(q.hasSolution),
        hasVideoSolution: Boolean(q.hasVideoSolution),
      };
    });
  }

  /**
   * Run synchronization process with batching
   */
  async syncDatabase(maxPages = 3): Promise<{ count: number; lastSyncTime: string; newAdded: number }> {
    if (this.isSyncing) {
      return {
        count: this.problems.size,
        lastSyncTime: this.lastSyncTime,
        newAdded: 0,
      };
    }

    this.isSyncing = true;
    let newCount = 0;

    try {
      const batchSize = 50;
      for (let page = 0; page < maxPages; page++) {
        const skip = page * batchSize;
        try {
          const batch = await this.fetchBatchFromLeetCode(skip, batchSize);
          if (batch.length === 0) break;

          batch.forEach(p => {
            if (!p.paidOnly) {
              const key = this.getProblemKey(p);
              if (!this.problems.has(key)) {
                newCount++;
              }
              this.problems.set(key, p);
            }
          });
        } catch (batchErr: any) {
          console.warn(`Sync batch page ${page} warning (will retain existing cache):`, batchErr.message);
          // If LeetCode rate limits or fails, preserve cached/seeded problems
          break;
        }
      }

      // Format formatted timestamp: e.g. "20 Sep 2026, 1:30 PM"
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      };
      this.lastSyncTime = now.toLocaleString('en-GB', options).replace(',', '');
      this.saveToDisk();

      return {
        count: this.problems.size,
        lastSyncTime: this.lastSyncTime,
        newAdded: newCount,
      };
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Get all problems in the database
   */
  getAllProblems(): LeetCodeProblemMetadata[] {
    return Array.from(this.problems.values());
  }

  /**
   * Filter out user solved problems
   * ALL AVAILABLE PROBLEMS - USER'S SOLVED PROBLEMS = PROBLEMS USER CAN STILL SOLVE
   */
  getUnsolvedProblems(userSolvedHistory: UserProblemHistory[]): LeetCodeProblemMetadata[] {
    const solvedSet = new Set<string>();

    userSolvedHistory.forEach(item => {
      if (item.title) solvedSet.add(item.title.toLowerCase().trim());
      if (item.slug) solvedSet.add(item.slug.toLowerCase().trim());
      if (item.title) {
        // also slugified form
        solvedSet.add(item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
        solvedSet.add(item.title.toLowerCase().replace(/[^a-z0-9]/g, ''));
      }
      if (item.problemId) {
        solvedSet.add(item.problemId.toLowerCase().trim());
      }
    });

    return Array.from(this.problems.values()).filter(p => {
      if (p.paidOnly) return false;
      const titleLower = p.title.toLowerCase().trim();
      const slugLower = p.titleSlug.toLowerCase().trim();
      const cleanTitle = p.title.toLowerCase().replace(/[^a-z0-9]/g, '');

      if (solvedSet.has(titleLower)) return false;
      if (solvedSet.has(slugLower)) return false;
      if (solvedSet.has(cleanTitle)) return false;
      if (solvedSet.has(p.problemId)) return false;
      if (solvedSet.has(p.frontendQuestionId)) return false;

      return true;
    });
  }

  getStatus() {
    return {
      lastSyncTime: this.lastSyncTime,
      totalIndexedProblems: this.problems.size,
      isSyncing: this.isSyncing,
      source: 'LeetCode Problemset Public Index',
    };
  }
}

export const problemDatabaseService = new ProblemDatabaseService();
