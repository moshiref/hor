import type { AboutContent, HeroContent } from '@/types/content'
import { getSiteContent } from '@/lib/siteStore'

/**
 * SiteContentService — abstraction over data source.
 *
 * Today: returns static data (from src/data).
 * Tomorrow: fetch from API/DB:
 *   async getHero(): Promise<HeroContent> { return fetch('/api/content/hero').then(r=>r.json()) }
 *
 * Components should import this service, not the raw data file.
 * This makes swapping to API a one-line change.
 */

export const siteContentService = {
  getHero(): HeroContent {
    return getSiteContent().hero
  },

  getAbout(): AboutContent {
    return getSiteContent().about
  },

  getPrograms() {
    return getSiteContent().programs
  },

  getWhyUs() {
    return getSiteContent().whyUs
  },

  getSchedule() {
    return getSiteContent().schedule
  },

  getActivities() {
    return getSiteContent().activities
  },

  getFooter() {
    return getSiteContent().footer
  },

  getContact() {
    return getSiteContent().contactSection
  },

  getLocationSection() {
    return getSiteContent().locationSection
  },

  getNavigation() {
    return getSiteContent().navigation
  },

  getSections() {
    return getSiteContent().sections
  },

  getStudentForm() {
    return getSiteContent().studentForm
  },

  getStaffForm() {
    return getSiteContent().staffForm
  },

  getHeader() {
    return getSiteContent().header
  },

  // Future — async variants ready for API:
  async getHeroAsync(): Promise<HeroContent> {
    return Promise.resolve(getSiteContent().hero)
  },

  async getAboutAsync(): Promise<AboutContent> {
    return Promise.resolve(getSiteContent().about)
  },
} as const
