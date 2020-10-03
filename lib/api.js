import fs from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
import glob from 'glob'

export class Api {
  
  constructor(baseDirectory){
    this.baseDirectory = baseDirectory;
  }
  
  getPostSlugs() {
    return glob.sync('*.md', {
      cwd: this.baseDirectory,
    });
  }
  
  getPostBySlug(slug, fields = []) {
    const realSlug = slug.replace(/\.md$/, '')
    const fullPath = join(this.baseDirectory, `${realSlug}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)
  
    const items = {}
  
    // Ensure only the minimal needed data is exposed
    fields.forEach((field) => {
      if (field === 'slug') {
        items[field] = realSlug
      }
      if (field === 'content') {
        items[field] = content
      }
  
      if (data[field]) {
        items[field] = data[field]
      }
    })
  
    return items
  }
  
  getAllPosts(fields = []) {
    const slugs = this.getPostSlugs()
    const posts = slugs
      .map((slug) => this.getPostBySlug(slug, fields))
      // sort posts by date in descending order
      .sort((post1, post2) => (post1.date > post2.date ? '-1' : '1'))
    return posts
  }
  
}

