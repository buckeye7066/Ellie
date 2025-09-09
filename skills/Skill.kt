package org.ellie.assistant.skills

/**
 * Interface for individual capabilities the assistant can perform.
 */
interface Skill {
    val name: String
    fun execute(input: String): Boolean
}
